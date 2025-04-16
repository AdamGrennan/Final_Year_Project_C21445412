from flask import request, jsonify
import statistics
from services.level_noise_service import LevelNoiseService

service = LevelNoiseService()

def level_noise_endpoint(pipe):
    data = request.json
    statement = data.get("input", "").strip()

    try:
        result = pipe(
            statement,
            candidate_labels=["lenient", "neutral", "harsh"]
        )
        labels = result["labels"]
        scores = result["scores"]
        
        top_label = labels[0]
        top_score = scores[0]
        neutral_score = scores[labels.index("neutral")]
        
        if neutral_score >= top_score - 0.1:
            detected_label = "neutral"
        else:
            detected_label = top_label


        return jsonify(insights), 200
    
    except Exception as e:
        print(f"Unhandled Exception in /level_noise: {e}")
        return jsonify({"error": str(e)}), 500

