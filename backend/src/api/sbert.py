from flask import request, jsonify
from src.PatternNoise.sbert_reflect import reflect_judgements

def sbert_endpoint(db):
    try:
        print("Request Method:", request.method)
        print("Request Headers:", request.headers)

        data = request.json
        print("Incoming Data:", data)

        user_id = data.get("user_id")
        judgment_id = data.get("judgmentId")
        breakdown = data.get("breakdown")
        detected_bias = data.get("detectedBias", [])
        detected_noise = data.get("detectedNoise", [])

        print(f"user_id: {user_id}, breakdown: {breakdown}, detected_biases: {detected_bias}, detected_noises: {detected_noise}")

        if not user_id or not breakdown:
            print("Error: Missing 'user_id' or 'breakdown' in the request.")
            return jsonify({"error": "Missing 'user_id' or 'breakdown'"}), 400

        print("Calling reflect_judgements...")
        insights = reflect_judgements(user_id, judgment_id, breakdown, detected_bias, detected_noise, db)
        print("Generated Insights:", insights)

        return jsonify({"insights": insights}), 200

    except Exception as e: 
        print(f"Unhandled Exception in /sbert: {e}")
        return jsonify({"error": str(e)}), 500