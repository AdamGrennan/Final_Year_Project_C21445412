from flask import request, jsonify
from src.Bias.predict import predict_bias

def bert_endpoint(model, tokenizer, bias_labels):
    data = request.json
    statement = data.get("input", "")
    if not statement:
        return jsonify({"ERROR": "No input provided"}), 400

    try:
        detected_biases = predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6)
        return jsonify({"predictions": detected_biases})
    except Exception as e:
        return jsonify({"error": str(e)}), 500