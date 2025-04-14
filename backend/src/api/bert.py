from flask import request, jsonify
from modules.bert.predict import predict_bias
import traceback 
import numpy as np

def bert_endpoint(model, tokenizer, bias_labels):
    data = request.json
    statement = data.get("input", "")
    if not statement:
        return jsonify({"ERROR at BERT": "No input provided"}), 400

    try:
        detected_biases = predict_bias(model, tokenizer, statement, bias_labels)
        
        for i in range(len(detected_biases)):
            if isinstance(detected_biases[i], np.float32):
                 detected_biases[i] = str(detected_biases[i])

        return jsonify({"predictions": detected_biases})
    
    except Exception as e:
        print("ERROR in BERT processing:", str(e))
        traceback.print_exc()  
        return jsonify({"error": str(e)}), 500