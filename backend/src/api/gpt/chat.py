from flask import request, jsonify
from bert.predict import predict_bias

def get_created_at(chat):
    return chat.get("createdAt", "")

def chat_endpoint(model, tokenizer, bias_labels, client):
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
                "You are SONUS, an intelligent assistant who helps users with decision making"
                 "You encourage critical thinking without overwhelming the user."
                 f"The user {name} is working on a decision titled {title}, described as {description}"
                    "Keep responses engaging, conversational, and concise."}
        ]   
        
        if context:
            sorted_context = sorted(context, key=get_created_at)
            for chat in sorted_context:
                role = "assistant" if chat.get("sender") == "GPT" else "user"
                messages.append({"role": role, "content": chat.get("text", "")})

        if statement:
            messages.append({"role": "user", "content": statement})
            
        if len(statement.split()) > 15:
            response_tokens = 200
        else:
            response_tokens = 100

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=response_tokens,
            temperature=0.7, 
        )
        
        response_text = response.choices[0].message.content.strip() if response.choices else "I'm sorry, I couldn't generate a response. Please try again."
       
        #if detected_biases:
            #bias_message = f"\nBy the way, I noticed a possible presence of {', '.join(detected_biases)}. Would you like to explore how that might be influencing your decision?"
            #response_text += bias_message


        return jsonify({"bias_feedback": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
