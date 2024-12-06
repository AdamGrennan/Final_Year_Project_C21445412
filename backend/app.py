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
    
@app.route('/gpt', methods=['POST'])
def gpt_endpoint():
    data = request.json
    statement = data.get("input", "")
    if not statement:
        return jsonify({"ERROR": "No input provided"}), 400

    try:
        detected_biases = predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6)

        feedback = {}
        for bias in detected_biases:
            if bias in BIAS_TYPES and bias != "Neutral":
  
                bias_prompt = f"""
                The user has shown signs of {bias}. Their input was:
                "{statement}"
                Provide:
                1. An explanation of {bias}.
                2. Its potential impact on decision-making.
                3. Suggestions for improving their judgment.
                4. Any additional details they would like to provide or follow up on.
                """
                response = openai.Completion.create(
                    model="gpt-4",
                    prompt=bias_prompt,
                    max_tokens=150,
                    temperature=0.7
                )
                feedback[bias] = response.choices[0].text.strip()

        situation_prompt = f"""
        The user has shared the following statement:
        "{statement}"
        Generate a response that provides real-world facts, advice, or discussion points
        relevant to the situation they are describing.
        """
        situation_response = openai.Completion.create(
            model="gpt-4",
            prompt=situation_prompt,
            max_tokens=200,
            temperature=0.8
        )
        situation_response = situation_response.choices[0].text.strip()

        return jsonify({
            "predictions": detected_biases,
            "bias_feedback": feedback,
            "situation_response": situation_response
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
