from flask import request, Response, jsonify
import time
from services.feedback_service import FeedbackService
from services.message_builder import MessageBuilder

def get_created_at(chat):
    return chat.get("createdAt", float("-inf"))

def stream_response(text):
    for chunk in text.splitlines(keepends=True): 
        yield chunk
        time.sleep(0.05)

def chat_endpoint(client):
    data = request.json
    
    name = data.get("name", "").strip() or "User"
    title = data.get("title", "").strip() or "No Title Provided"
    details = data.get("details", {})
    situation = details.get("situation", "").strip()
    statement = data.get("input", "").strip()
    context = data.get("context", [])
    detectedNoise = data.get("detectedNoise", [])
    detectedBias = data.get("detectedBias", [])
    pattern_context = data.get("patternContext")
    recencyInfo = data.get("recencyInfo", "")

    try:
        feedback_service = FeedbackService()
        feedback_data = feedback_service.fetch_feedback(data.get("userId"))
        previous_chats = feedback_service.fetch_chats_for_decision(data.get("userId"), data.get("judgementId"))
        chat_instruction = feedback_service.generate_instruction(feedback_data, previous_chats)

        if feedback_data:
            feedback_service.mark_feedback(feedback_data[0].get("id"))

        builder = MessageBuilder(name, title, situation, chat_instruction)

        if not statement:
            builder.build_open_message()
            messages = builder.get_messages()

            response = client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=150,
                temperature=0.7,
            )


            response_text = (
                response.choices[0].message.content.strip()
                if response.choices
                else "I'm sorry, I couldn't generate a response. Please try again."
            )
            print("FEEDBACK RETURNING TO FRONTEND:", {
             "text": response_text,
            "feedbackUsed": bool(feedback_data)
                })

            return jsonify({
             "text": response_text,
             "feedbackUsed": bool(feedback_data)
                })


        builder.build_system_message(detectedBias, detectedNoise, pattern_context, recencyInfo)
        builder.build_context_message(context)

        last_system_message = None
        if context:
            sorted_context = sorted(context, key=get_created_at)
            for chat in sorted_context:
                if chat.get("sender") == "GPT":
                    last_system_message = chat.get("text", "").strip()

        builder.build_user_response(statement, last_system_message)
        messages = builder.get_messages()

        context_length = sum(len(msg["content"].split()) for msg in messages)
        if context_length > 100:
            response_tokens = 500
        elif len(statement.split()) > 15:
            response_tokens = 350
        else:
            response_tokens = 250

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=response_tokens,
            temperature=0.5,
        )

        response_text = (
            response.choices[0].message.content.strip()
            if response.choices
            else "I'm sorry, I couldn't generate a response. Please try again."
        )

        return Response(stream_response(response_text), content_type="text/plain")

    except Exception as e:
        return jsonify({"error": str(e)}), 500
