from flask import request, Response, jsonify
from bert.predict import predict_bias
import time
from service.feedback_service import FeedbackService

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

    try:
        if not statement and title:
            opening_message = (
                f"Hey {name}! I'm Sonus, your decision-support assistant. "
                f"I'm here to help you reflect on potential noise and bias in your decision-making process. "
                f"How can I assist you with your decision about {title}?"
            )
            return jsonify({"bias_feedback": opening_message}), 200

        detected_biases = predict_bias(model, tokenizer, statement, bias_labels)
        detected_biases = [bias for bias in detected_biases if bias in bias_labels]
        
        feedback_service = FeedbackService()
        feedback_data = feedback_service.fetch_feedback(data.get("userId"))
        previous_chats = feedback_service.fetch_chats_for_decision(data.get("userId"), data.get("judgementId"))
        chat_instruction = feedback_service.generate_instruction(feedback_data, previous_chats)
        print(f"[Chat] Creating feedback-based instruction: {chat_instruction}")
        
        if feedback_data:
         doc_id = feedback_data[0]["id"]
         feedback_service.mark_feedback(doc_id)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are SONUS, an intelligent assistant helping users reflect on noise and bias in decision-making. "
                    f"The user {name} is considering: '{title}'"
                    f"The user {name} is considering a decision titled '{title}'. "
                    f"The situation is: '{situation}'. "
                    f"Options they are considering include: '{options}'. "
                    f"Factors influencing them: '{influences}'. "
                    f"Their ideal goal is: '{goal}'. "
                    "Ensure responses follow the previous conversation naturally. "
                    "If the user responds with 'yes' or asks for help, assume they are referring to the last topic discussed. "
                    "Never ask the user to repeat themselves; instead, continue based on the last message in context."
                    "Ensure responses follow the previous conversation naturally. "
                    f"{chat_instruction}"
                ),
            }
        ]

        last_system_message = None 

        if context:
            sorted_context = sorted(context, key=get_created_at)
            context_summary = ""

            for idx, chat in enumerate(sorted_context):
                sender = chat.get("sender", "Unknown")
                past_message = chat.get("text", "").strip()
                past_biases = chat.get("detectedBias", [])
                past_noises = chat.get("detectedNoise", [])

                past_biases_str = ", ".join(past_biases) if isinstance(past_biases, list) else str(past_biases)
                past_noises_str = ", ".join(past_noises) if isinstance(past_noises, list) else str(past_noises)

                print(f"Context Message {idx + 1}:")
                print(f"   - Sender: {sender}")
                print(f"   - Message: {past_message}")
                print(f"   - Detected Biases: {past_biases_str}")
                print(f"   - Detected Noises: {past_noises_str}")

                if not past_message:
                    print("Skipping empty message\n")
                    continue 

                role = "assistant" if sender == "GPT" else "user"
                messages.append({"role": role, "content": past_message})

                if role == "assistant":
                    last_system_message = past_message

            if last_system_message:
                print(f"Last Assistant Message Successfully Tracked: {last_system_message}")
            else:
                print("No Assistant Message Found in Context!")



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
        response_tokens = 250 if context_length > 100 else 200 if len(statement.split()) > 15 else 120

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
