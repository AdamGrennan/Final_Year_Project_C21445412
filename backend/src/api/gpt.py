from flask import request, jsonify
from src.Bias.predict import predict_bias
import openai

openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

BIAS_TYPES = ["OverconfidenceBias", "ConfirmationBias", "AnchoringBias", "Neutral"]

def gpt_endpoint(model, tokenizer, bias_labels):
    data = request.json
    statement = data.get("input", "")
    if not statement:
        return jsonify({"error": "No input provided. Could you share more about the situation or decision you’re reflecting on?"}), 400

    try:
        detected_biases = predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6)
        print(f"Detected Biases (BERT): {detected_biases}")

        biases = []
        for bias in detected_biases:
             if bias in BIAS_TYPES and bias:
                biases.append(bias)

        detected_biases = biases

        if not detected_biases:
            return jsonify({"bias_feedback": "No significant biases detected. Feel free to elaborate or share more details."})

        combined_biases = ", ".join(detected_biases)
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant providing concise feedback on biases. "
                    "Keep responses brief, focusing on acknowledgment and a follow-up question."
                )
            },
            {
                "role": "user",
                "content": (
                    f"The user has shown signs of the following biases: {combined_biases}. Their input was:\n"
                    f"\"{statement}\"\n"
                    "Provide concise feedback as described."
                )
            }
        ]

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=70,
            temperature=0.7
        )

        print(f"Full GPT response: {response}")

        if response.choices and len(response.choices) > 0:
            feedback = response.choices[0].message['content'].strip()
        else:
            feedback = "No valid feedback generated."

        return jsonify({"bias_feedback": feedback})

    except Exception as e:
        print(f"Unhandled exception: {e}")
        return jsonify({"error": str(e)}), 500
