from flask import request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from services.pattern_noise_service import PatternNoiseService

service = PatternNoiseService()

def pattern_noise_endpoint(sbert_model, threshold=0.5):
    data = request.json
    user_id = data.get("user_id")
    judgment_id = data.get("judgementId")
    message = data.get("message")
    detected_bias = data.get("detectedBias", [])
    detected_noise = data.get("detectedNoise", [])

    detected_judgment_ids = set()

    if not user_id or not judgment_id or not message:
        print(f"Missing fields - user_id: {user_id}, judgment_id: {judgment_id}, message: {message}")
        return jsonify({"error": "Missing required fields"}), 400

    current_chat_messages = [{
        "text": message,
        "judgementId": judgment_id,
        "detected_bias": detected_bias,
        "detected_noise": detected_noise
    }]

    all_user_chats = service.fetch_chats(user_id)

    if not all_user_chats:
        print(f"No chat messages found for user {user_id}")
        return jsonify({
            "similarDecisions": [],
            "patternNoiseSources": [],
        })

    past_chats = [chat for chat in all_user_chats if chat.get("judgementId") != judgment_id]
    if not past_chats:
        print("No past chats found to compare against.")
        return jsonify({
            "similarDecisions": [], 
            "patternNoiseSources": []
        })

    current_texts = message.strip()
    encoded_current_chat = sbert_model.encode([current_texts]).reshape(1, -1)

    encoded_past_chats = sbert_model.encode([chat["text"].strip() for chat in past_chats])

    similarities = cosine_similarity(encoded_current_chat, encoded_past_chats)[0]

    similar_decisions = []
    pattern_noise_sources = []
    pattern_noise_messages = []

    for i, score in enumerate(similarities):
        similar_chat = past_chats[i]
        print(f"Similarity to past chat [{similar_chat.get('text', '')[:30]}...]: {score:.2f}")

        if score > threshold:
            print(f"High similarity detected (score {score:.2f}) with past chat: {similar_chat['text']}")

            judgment_id_similar = similar_chat.get("judgementId")
            if judgment_id_similar in detected_judgment_ids:
                print(f"Already detected pattern noise for judgment {judgment_id_similar}, skipping.")
                continue

            past_chat_messages = [similar_chat]

            if service.is_pattern_noise(current_chat_messages, past_chat_messages, sbert_model):
                print(f"Pattern Noise Detected between '{similar_chat['text']}' and current judgment chats.")
                detected_judgment_ids.add(judgment_id_similar)

                pattern_noise_messages.append({
                    "current_message": message,
                    "similar_message": similar_chat["text"],
                    "judgmentId": judgment_id_similar,
                    "previous_decision_title": similar_chat.get("title", "Previous Decision")
                })

                similar_decisions.append({
                    "judgmentId": judgment_id_similar,
                    "similarity": float(score),
                    "text": similar_chat["text"]
                })

    if pattern_noise_messages:

        for item in pattern_noise_messages:
            pattern_noise_sources.append({
                "judgmentId": item["judgmentId"],
                "source": item.get("previous_decision_title", "Previous Decision")
            })

    insights = {
        "similarDecisions": similar_decisions,
        "patternNoiseSources": pattern_noise_sources,
    }

    print(f"Sending Response: {insights}")
    return jsonify(insights)
