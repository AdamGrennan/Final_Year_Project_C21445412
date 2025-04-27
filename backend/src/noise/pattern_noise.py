from flask import request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import requests
from src.services.pattern_noise_service import fetch_chats, is_pattern_noise

def pattern_noise_endpoint(sbert_model, db, threshold=0.5):
    data = request.json

    user_id = data.get("user_id")
    judgment_id = data.get("judgementId") 
    message = data.get("message") 
    detected_bias = data.get("detectedBias", [])
    detected_noise = data.get("detectedNoise", [])
    
    if not user_id or not judgment_id or not message:
        print(f"Missing fields - user_id: {user_id}, judgment_id: {judgment_id}, message: {message}")
        return jsonify({"error": "Missing required fields"}), 400

    all_user_chats = fetch_chats(user_id, db)

    if not all_user_chats:
        print(f"No chat messages found for user {user_id}")
        return jsonify({
            "similarDecisions": [],
            "patternNoiseSources": [],
        })

    encoded_current_chat = sbert_model.encode([message]).reshape(1, -1)  

    past_chats = [chat["text"] for chat in all_user_chats]
    encoded_past_chats = sbert_model.encode(past_chats)

    similarities = cosine_similarity(encoded_current_chat, encoded_past_chats)[0]

    similar_decisions = []
    pattern_noise_sources = []

    for i, score in enumerate(similarities):
        similar_chat = all_user_chats[i]
        
        if similar_chat.get("judgementId") == judgment_id:
            continue  
        
        score = float(score) 
        if score > threshold:
            print(f"Similar Chat (Score: {score}): {similar_chat}")

            past_chat_messages = [similar_chat]
            current_chat_messages = [{"text": message, "detected_bias": detected_bias, "detected_noise": detected_noise}]

            if is_pattern_noise(current_chat_messages, past_chat_messages, sbert_model):
                print(f"Pattern Noise Detected: Current chat has bias/noise, but similar past chat did not.")

                pattern_noise_message = (
                    f"User's recent message: '{message}'. "
                    f"A highly similar past chat '{similar_chat['text']}' had no bias or noise. "
                    f"This suggests possible Pattern Noise."
                )

                response = requests.post("http://127.0.0.1:5000/source", json={
                    "message": pattern_noise_message,
                    "detectedNoise": ["Pattern Noise"]
                })
                
                source_summary = response.json().get("summary", "Pattern Noise detected in chat discussions.")
                
                judgment_id = similar_chat.get("judgementId")
                if not judgment_id:
                 print("Skipping similar chat with missing judgmentId.")
                 continue 

                pattern_noise_sources.append({
                 "judgmentId": judgment_id,
                 "source": source_summary})

                similar_decisions.append({
                 "judgmentId": judgment_id,
                 "similarity": score,
                "text": similar_chat["text"]})
    insights = {
        "similarDecisions": similar_decisions,
        "patternNoiseSources": pattern_noise_sources,
    }

    print(f"Sending Response: {insights}") 
    return jsonify(insights)


