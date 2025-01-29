from flask import request, jsonify

def level_noise_endpoint(pipe):
    data = request.json
    statement = data.get("input", "").strip()
    try:
   
        result = pipe(
            statement,
            candidate_labels=["lenient", "neutral", "harsh"],
        )
        
        scores = {label: score for label, score in zip(result["labels"], result["scores"])}
        
        level_noise_score = 0
        if "lenient" in scores:
            level_noise_score += scores["lenient"] * 100  
        if "harsh" in scores:
            level_noise_score += scores["harsh"] * 100  

        if "neutral" in scores:
            level_noise_score = max(level_noise_score - (scores["neutral"] * 50), 0)
        
        level_noise_score = round(level_noise_score, 2)
        print("Level Noise Response:", level_noise_score)

        insights = {
            "level_noise_percentage": level_noise_score,
            "confidence_scores": scores,
        }

        return jsonify(insights), 200
    
    except Exception as e:
        print(f"Unhandled Exception in /level_noise: {e}")
        return jsonify({"error": str(e)}), 500
