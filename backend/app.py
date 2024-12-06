from flask import Flask, request, jsonify
from flask_cors import CORS
from src.load_model import load_model
from src.predict import predict_bias
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

model, tokenizer, bias_labels = load_model()
BIAS_TYPES = ["OverconfidenceBias", "ConfirmationBias", "AnchoringBias", "Neutral"]


@app.route('/bert', methods=['POST'])
def bert_endpoint():

    data = request.json
    statement = data.get("input", "")
    if not statement:
        return jsonify({"ERROR": "No input provided"}), 400

    try:
        detected_biases = predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6)

        return jsonify({"predictions": detected_biases})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
