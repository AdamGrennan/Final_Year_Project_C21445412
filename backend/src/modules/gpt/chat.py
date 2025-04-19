from flask import request, Response, jsonify
from modules.bert.predict import predict_bias
import time
from services.feedback_service import FeedbackService
from modules.gpt.prompts import get_opening_message, get_system_prompt

def get_created_at(chat):
    return chat.get("createdAt", float("-inf"))  

def stream_response(text):
    for word in text.split():
        yield word + " "
        time.sleep(0.1)

def chat_endpoint(model, tokenizer, bias_labels, client):
    data = request.json
    name = data.get("name", "").strip() or "User"
    title = data.get("title", "").strip() or "No Title Provided"
    details = data.get("details", {})
    situation = details.get("situation", "").strip()
    options = details.get("options", "").strip()
    influences = details.get("influences", "").strip()
    goal = details.get("goal", "").strip()
    statement = data.get("input", "").strip()
    context = data.get("context", [])
    detectedNoise = data.get("detectedNoise", [])
    detectedBias = data.get("detectedBias", [])
    pattern_context = data.get("patternContext")
    
    print("CHAT TEST", detectedNoise)
    print("CHAT TEST", detectedBias)

    try:
        if not statement and title:
            opening_message = get_opening_message(name, title)
            return jsonify({"bias_feedback": opening_message}), 200

        detected_biases = predict_bias(model, tokenizer, statement, bias_labels)
        detected_biases = [bias for bias in detected_biases if bias in bias_labels]
        
        feedback_service = FeedbackService()
        feedback_data = feedback_service.fetch_feedback(data.get("userId"))
        previous_chats = feedback_service.fetch_chats_for_decision(data.get("userId"), data.get("judgementId"))
        chat_instruction = feedback_service.generate_instruction(feedback_data, previous_chats)
        print(f"[Chat] Creating feedback-based instruction: {chat_instruction}")
        
        doc_id = None
        if feedback_data:
         doc = feedback_data[0]
         doc_id = doc.get("id") 
        if doc_id:
            feedback_service.mark_feedback(doc_id)


        messages = [
            {
                "role": "system",
                "content": 
                    get_system_prompt(name, title, situation, options, influences, goal, chat_instruction),
            }
        ]
        
        if pattern_context:
         previous_title = pattern_context.get("title", "")
         previous_summary = pattern_context.get("summary", "")

         messages.append({
        "role": "system",
        "content": (
            f"The user previously made a similar decision titled '{previous_title}'. "
            f"Here’s a summary of that decision: '{previous_summary}'. "
            "Use this to help tailor your response and encourage the user to reflect."
        )
            })
             
        if detectedBias or detectedNoise:
            messages.append({
        "role": "system",
        "content": (
            "Note: The user's current message was associated with the following:\n"
            f"Biases: {', '.join(detectedBias) if detectedBias else 'None'}\n"
            f"Noise: {', '.join(detectedNoise) if detectedNoise else 'None'}\n"
            "Use this to inform your response — for example, suggest reflection or reframe their thinking if relevant."
        )
    })

        last_system_message = None 

        if context:
            sorted_context = sorted(context, key=get_created_at)

            for idx, chat in enumerate(sorted_context):
                sender = chat.get("sender", "Unknown")
                past_message = chat.get("text", "").strip()

                if not past_message:
                    continue

                role = "assistant" if sender == "GPT" else "user"
                messages.append({"role": role, "content": past_message})

                if role == "assistant":
                    last_system_message = past_message

        if statement:
            if last_system_message:
                statement = f"User follows up: {statement} (This is in response to: '{last_system_message}')"
                messages.append(
                    {
                        "role": "system",
                        "content": f"Reminder: The user's last message is a direct response to your previous answer: '{last_system_message}'.",
                    }
                )
            else:
                statement = f"User states: {statement}"

            messages.append({"role": "user", "content": statement})

        context_length = sum(len(msg["content"].split()) for msg in messages)
        if context_length > 100:
         response_tokens = 250
        elif len(statement.split()) > 15:
         response_tokens = 200
        else:
         response_tokens = 120

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=response_tokens,
            temperature=0.7,
        )

        response_text = (
            response.choices[0].message.content.strip()
            if response.choices
            else "I'm sorry, I couldn't generate a response. Please try again."
        )

        return Response(stream_response(response_text), content_type="text/plain")

    except Exception as e:
        return jsonify({"error": str(e)}), 500
