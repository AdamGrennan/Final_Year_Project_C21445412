from flask import request, jsonify
from src.Bias.predict import predict_bias
import openai
import datetime

openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

BIAS_TYPES = ["OverconfidenceBias", "ConfirmationBias", "AnchoringBias", "Neutral"]

def gpt_endpoint(model, tokenizer, bias_labels):
    data = request.json
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    statement = data.get("input", "").strip()
    context = data.get("context", [])
    
    print(f"[{datetime.datetime.now()}] Received request for: {title}")
    print(f"Full request data: {data}")


    try:
        if not statement and title and description:
            opening_message = f"Hey! How can I help with your decision about '{title}'?"
            return jsonify({"bias_feedback": opening_message}), 200

        detected_biases = predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6)
        detected_biases = [bias for bias in detected_biases if bias in BIAS_TYPES]

        messages = [
            {"role": "system",
             "content": 
                "You are SONUS, a decision-support assistant that helps users reflect and identify biases."
                 "Your job is to guide users through reflecting on decisions, asking meaningful questions, "
                 "and offering thoughtful insights. You are professional, empathetic, and concise in your responses."
                 f"The user is working on a decision titled {title}, described as {description}"}
        ]   
        
        messages.extend(
            {"role": "assistant" if chat["sender"] == "GPT" else "user", "content": chat["content"]}
            for chat in context
        )
        if statement:
            messages.append({"role": "user", "content": statement})

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=200,
            temperature=0.7, 
        )

        feedback = response.choices[0].message['content'].strip() if response.choices else "I'm sorry, I couldn't generate a response. Please try again."
        return jsonify({"bias_feedback": feedback})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
