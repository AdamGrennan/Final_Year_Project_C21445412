from flask import request, Response, jsonify
import time
from services.feedback_service import FeedbackService
from flask import request, Response, jsonify
from services.feedback_service import FeedbackService
from services.message_builder import MessageBuilder

def get_created_at(chat):
    return chat.get("createdAt", float("-inf"))  

def stream_response(text):
    for word in text.split():
        yield word + " "
        time.sleep(0.1)

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
    message_count = data.get("messageCount", 0)

    try:
        if not statement and title:
            from modules.gpt.prompts import get_opening_message
            opening_message = get_opening_message(name, title)
            return jsonify({"bias_feedback": opening_message}), 200

        feedback_service = FeedbackService()
        feedback_data = feedback_service.fetch_feedback(data.get("userId"))
        previous_chats = feedback_service.fetch_chats_for_decision(data.get("userId"), data.get("judgementId"))
        chat_instruction = feedback_service.generate_instruction(feedback_data, previous_chats)

        if feedback_data:
            feedback_service.mark_feedback(feedback_data[0].get("id"))

        builder = MessageBuilder(name, title, situation, chat_instruction)

        if message_count >= 1: 
             builder.build_prompt_suggestions() 

        builder.build_open_message()
        builder.build_noise_bias_message(detectedBias, detectedNoise)
        
        if recencyInfo:  
         builder.build_recency_message(recencyInfo)
         
        builder.build_system_message()
        builder.build_pattern_message(pattern_context)
        builder.build_context_message(context)

        last_system_message = None
        if context:
            sorted_context = sorted(context, key=lambda c: c.get("createdAt", float("-inf")))
            for chat in sorted_context:
                if chat.get("sender") == "GPT":
                    last_system_message = chat.get("text", "").strip()

        builder.build_user_response(statement, last_system_message)

        messages = builder.get_messages()

        context_length = sum(len(msg["content"].split()) for msg in messages)
        
        if context_length > 100:
         response_tokens = 300
        elif len(statement.split()) > 15:
         response_tokens = 250
        else:
         response_tokens = 150

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
