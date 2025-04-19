from flask import request, jsonify
from services.level_noise_service import LevelNoiseService

service = LevelNoiseService()

def level_noise_scores_endpoint():
    data = request.json
    action = data.get("action")  
    user_id = data.get("user_id")
    judgment_id = data.get("judgment_id", "")
    score = data.get("score", None)
    entry_type = data.get("type", "average")

    if action == "save" and score is not None:
        return service.save_score(user_id, judgment_id, score, entry_type)

    elif action == "fetch":
        scores = service.fetch_scores(user_id, entry_type)
        return jsonify({"scores": scores})
    
    return jsonify({"error": "Invalid Level Noise action"}), 400

from flask import request, jsonify
import statistics
from services.level_noise_service import LevelNoiseService

service = LevelNoiseService()

def level_noise_endpoint(pipe):
    data = request.json
    statement = data.get("input", "").strip()
    user_id = data.get("user_id", "")
    current_avg = data.get("current_avg", None)

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

        if current_avg is not None:
            try:
                current_avg = float(current_avg)
                previous_scores = service.fetch_scores(user_id, entry_type="average")

                if len(previous_scores) >= 3:
                    avg = statistics.mean(previous_scores)
                    std = statistics.stdev(previous_scores)
                    threshold = max(0.3, 0.7 * std)

                    if current_avg > avg + threshold:
                        response["type"] = "harsh"
                        response["message"] = f"Compared to your previous decisions, your judgment in this case was notably more harsh. This may indicate a shift in tone or emotional response."
                    elif current_avg < avg - threshold:
                        response["type"] = "lenient"
                        response["message"] = f"Compared to your previous decisions, your judgment in this case was notably more lenient. This may indicate a shift in tone or emotional response."
                    else:
                        response["type"] = "neutral"
                        response["message"] = "Your tone is consistent with previous decisions."

            except Exception as error:
                print(f"Logic error: {error}")
                response["type"] = "none"
                response["message"] = "none."

        return jsonify(response), 200

    except Exception as e:
        print(f"Unhandled Exception in LEVEL: {e}")
        return jsonify({"error": str(e)}), 500

