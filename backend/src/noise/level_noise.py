from flask import request, jsonify
import statistics
from services.level_noise_service import LevelNoiseService

service = LevelNoiseService()

def level_noise_scores_endpoint():
    data = request.json
    action = data.get("action")  
    user_id = data.get("user_id")
    judgment_id = data.get("judgment_id", "")
    score = data.get("score", None)

    if action == "save" and score is not None:
        return service.save_score(user_id, judgment_id, score)

    elif action == "fetch":
        scores = service.fetch_scores(user_id)
        return jsonify({"scores": scores})
    
    return jsonify({"error": "Invalid Level Noise action"}), 400


def level_noise_endpoint(pipe):
    data = request.json
    statement = data.get("input", "").strip()
    user_id = data.get("user_id", "")
    judgment_id = data.get("judgment_id", "")

    if statement == "fetch_level_noise":
        try:
            current_score = service.fetch_score_by_decision(user_id, judgment_id)
            print(f"Current Score for Judgment {judgment_id}: {current_score}")

            all_scores = service.fetch_scores(user_id)
            past_scores = [s for s in all_scores if s != current_score][:2]

            if len(past_scores) < 2:
                print("Not enough past scores for comparison.")
                return jsonify({
                    "type": "none",
                    "message": "Not enough previous decisions to assess level noise.",
                    "current_score": current_score
                }), 200

            avg = statistics.mean(past_scores)
            std_dev = statistics.stdev(past_scores)
            threshold = std_dev if std_dev > 0 else 0.5
            print(f"AVG: {avg} | STD_DEV: {std_dev} | THRESHOLD: {threshold}")

            if current_score > avg + threshold:
                type_ = "harsh"
                message = "Compared to your usual decisions, this was notably more harsh."
            elif current_score < avg - threshold:
                type_ = "lenient"
                message = "Compared to your usual decisions, this was notably more lenient."
            else:
                type_ = "none"
                message = "No significant level noise detected."

            print(f"Type: {type_} | Message: {message}")
            return jsonify({
                "type": type_,
                "message": message,
                "current_score": current_score
            }), 200

        except Exception as error:
            print(f"Level noise check error: {error}")
            return jsonify({
                "type": "none",
                "message": "Error calculating level noise.",
                "current_score": None
            }), 200
    try:
        result = pipe(statement, candidate_labels=["lenient", "neutral", "harsh"])
        labels = result["labels"]
        scores = result["scores"]

        top_label = labels[0]
        top_score = scores[0]
        neutral_score = scores[labels.index("neutral")]
        detected_label = top_label if neutral_score < top_score - 0.1 else "neutral"

        label_to_score = {"lenient": 0, "neutral": 1, "harsh": 2}
        current_score = label_to_score.get(detected_label, 1)

        response = {
            "detected_label": detected_label,
            "statement": statement,
            "current_score": current_score,
        }

        print(f"Statement: '{statement}' | Label: {detected_label} | Score: {current_score}")
        return jsonify(response), 200

    except Exception as e:
        print(f"Unhandled Exception: {e}")
        return jsonify({"error": str(e)}), 500
