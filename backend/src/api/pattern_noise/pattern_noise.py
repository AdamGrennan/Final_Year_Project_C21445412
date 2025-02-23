from flask import request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import requests

MAX_DECISIONS = 2  

def pattern_noise_endpoint(sbert_model, db, threshold=0.7):
    data = request.json
    print("\nReceived Request Data:", data) 

    user_id = data.get("user_id")
    judgment_id = data.get("judgmentId")
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
        score = float(score) 
        if score > threshold:
            similar_chat = all_user_chats[i]
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

                pattern_noise_sources.append({
                    "judgmentId": similar_chat["judgmentId"],
                    "source": source_summary
                })

                similar_decisions.append({
                    "judgmentId": similar_chat["judgmentId"],
                    "similarity": score,
                    "text": similar_chat["text"]
                })

    insights = {
        "similarDecisions": similar_decisions,
        "patternNoiseSources": pattern_noise_sources,
    }

    print(f"Sending Response: {insights}") 
    return jsonify(insights)


def fetch_decisions(user_id, db):
    judge_ref = db.collection("judgement").where("userId", "==", user_id)
    docs = judge_ref.stream()

    decisions = []
    for doc in docs:
        data = doc.to_dict()
        if data:
            decisions.append({
                "judgmentId": doc.id,
                "theme": data.get("theme", ""),
                "createdAt": data.get("createdAt", ""),
                "detectedBias": data.get("detectedBias", []),
                "detectedNoise": data.get("detectedNoise", []),
            })

    return decisions

def fetch_chats(user_id, db):
    print(f"Fetching ALL chats for user: {user_id}")

    chat_ref = db.collection("chat").where("userId", "==", user_id).where("sender", "==", "user")
    docs = chat_ref.stream()

    messages = []
    for doc in docs:
        data = doc.to_dict()
        if data:
            messages.append({
                "text": data.get("text", ""),
                "judgmentId": data.get("judgmentId", ""),
                "detected_bias": data.get("detectedBias", []),
                "detected_noise": data.get("detectedNoise", []),
            })

    print(f"Retrieved {len(messages)} total chat messages for user {user_id}")
    return messages

def is_pattern_noise(current_messages, past_messages, sbert_model):
    print("Running is_pattern_noise()")

    current_texts = " | ".join([msg["text"] for msg in current_messages[-3:]])
    past_texts = " | ".join([msg["text"] for msg in past_messages[-3:]])

    if not current_texts or not past_texts:
        print("Not enough chat messages for comparison")
        return False

    current_vector = sbert_model.encode([current_texts])[0]
    past_vector = sbert_model.encode([past_texts])[0]

    similarity = cosine_similarity([current_vector], [past_vector])[0][0]
    print(f"Pattern Noise Similarity Score: {similarity}")

    if similarity > 0.6:
        past_has_bias = any(msg["detected_bias"] for msg in past_messages)
        past_has_noise = any(msg["detected_noise"] for msg in past_messages)

        current_has_bias = any(msg["detected_bias"] for msg in current_messages)
        current_has_noise = any(msg["detected_noise"] for msg in current_messages)

        if not past_has_bias and not past_has_noise and (current_has_bias or current_has_noise):
            print(f"Pattern Noise Detected!")
            return True

    return False
