from flask import request, jsonify
from src.Onoise.predict import predict_noise

def occasion_noise_endpoint(model, tokenizer, noise_labels):
    data = request.json
    statement = data.get("input", "")
    if not statement:
        return jsonify({"ERROR": "No input provided"}), 400

    try:
        occasion_noise = predict_noise(model, tokenizer, statement, noise_labels, threshold=0.6)
        return jsonify({"predictions": occasion_noise})
    except Exception as e:
        return jsonify({"error": str(e)}), 500