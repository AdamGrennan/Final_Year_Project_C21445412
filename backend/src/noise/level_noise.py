from flask import request, jsonify
import statistics
from services.level_noise_service import LevelNoiseService

service = LevelNoiseService()

def level_noise_endpoint(pipe):
    data = request.json
    statement = data.get("input", "").strip()
    user_id = data.get("user_id", "")

    try:
        result = pipe(statement, candidate_labels=["lenient", "neutral", "harsh"])
        labels = result["labels"]
        scores = result["scores"]

        top_label = labels[0]
        top_score = scores[0]
        neutral_score = scores[labels.index("neutral")]

        if neutral_score >= top_score - 0.1:
            detected_label = "neutral"
        else:
            detected_label = top_label

        label_to_score = {"lenient": 0, "neutral": 1, "harsh": 2}
        current_score = label_to_score[detected_label]

        user_scores = service.fetch_level_scores(user_id)
        avg = statistics.mean(user_scores) if user_scores else 1
        std = statistics.stdev(user_scores) if len(user_scores) > 1 else 0.5
        threshold = 0.7 * std

        if current_score > avg + threshold:
            level_noise = "harsh level noise detected"
        elif current_score < avg - threshold:
            level_noise = "lenient level noise detected"
        else:
            level_noise = "level noise neurtral range"

        service.save_level_score(user_id, current_score)

        insights = {
            "confidence_scores": dict(zip(labels, scores)),
            "detected_label": detected_label,
            "confidence": top_score,
            "statement": statement,
            "level_noise_status": level_noise,
            "average_score": avg,
            "std_dev": std,
            "current_score": current_score,
        }

        return jsonify(insights), 200

    except Exception as e:
        print(f"Unhandled Exception in /level_noise: {e}")
        return jsonify({"error": str(e)}), 500
