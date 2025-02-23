from flask import request, jsonify

def level_noise_endpoint(pipe):
    data = request.json
    statement = data.get("input", "").strip()

    try:
        result = pipe(
            statement,
            candidate_labels=["neutral", "harsh"],
        )

        scores = {}
        for label, score in zip(result["labels"], result["scores"]):
         scores[label] = score

        detected_label = result["labels"][0] 
        confidence = result["scores"][0]  
        
        insights = {
            "confidence_scores": scores,
            "detected_label": detected_label,
            "confidence": confidence,
            "statement": statement, 
        }

        return jsonify(insights), 200
    
    except Exception as e:
        print(f"Unhandled Exception in /level_noise: {e}")
        return jsonify({"error": str(e)}), 500
