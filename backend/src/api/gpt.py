from flask import request, jsonify
from src.Bias.predict import predict_bias
from openai import OpenAI

client = OpenAI(api_key="sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA")

def get_created_at(chat):
    return chat.get("createdAt", "")

def gpt_endpoint(model, tokenizer, bias_labels):
    data = request.json
    name = data.get("name", "").strip()
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    statement = data.get("input", "").strip()
    context = data.get("context", [])

    print(f"Full request data: {data}")

    try:
        if not statement and title and description:
            
            opening_message = (
                f"Hey {name}! I'm Sonus, your decision-support assistant. "
                f"I'm here to help you reflect on potential noise and bias in your decision-making process."
                f"How can I assist you with your decision about {title}?"
            )
             
            return jsonify({"bias_feedback": opening_message}), 200

        detected_biases = predict_bias(model, tokenizer, statement, bias_labels)
        detected_biases = [bias for bias in detected_biases if bias in bias_labels]

        messages = [
            {"role": "system",
             "content": 
                "You are SONUS, a decision-support assistant that helps users reflect and identify biases."
                 "Your job is to guide users through reflecting on decisions, asking meaningful questions, "
                 "and offering thoughtful insights. You are professional, empathetic, and concise in your responses."
                 f"The user {name} is working on a decision titled {title}, described as {description}"}
        ]   
        
        if context:
            sorted_context = sorted(context, key=get_created_at)
            for chat in sorted_context:
                role = "assistant" if chat.get("sender") == "GPT" else "user"
                messages.append({"role": role, "content": chat.get("text", "")})

        if statement:
            messages.append({"role": "user", "content": statement})

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=200,
            temperature=0.7, 
        )

        feedback = response.choices[0].message.content.strip() if response.choices else "I'm sorry, I couldn't generate a response. Please try again."
        return jsonify({"bias_feedback": feedback})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
