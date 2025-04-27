from sklearn.metrics.pairwise import cosine_similarity

def fetch_chats(user_id, db):

    chat_ref = db.collection("chat").where("userId", "==", user_id).where("sender", "==", "user")
    docs = chat_ref.stream()

    messages = []
    for doc in docs:
        data = doc.to_dict()
        if data:
            messages.append({
                "text": data.get("text", ""),
                "judgementId": data.get("judgementId", ""),
                "detected_bias": data.get("detectedBias", []),
                "detected_noise": data.get("detectedNoise", []),
            })

    print(f"Retrieved {len(messages)} total chat messages for user {user_id}")
    return messages

def is_pattern_noise(current_messages, past_messages, sbert_model):
    current_texts = " | ".join([msg["text"] for msg in current_messages[-3:]])
    past_texts = " | ".join([msg["text"] for msg in past_messages[-3:]])

    if not current_texts or not past_texts:
        print("Not enough chat messages for comparison")
        return False

    current_encoded_messages = sbert_model.encode([current_texts])[0]
    past_encoded_messages = sbert_model.encode([past_texts])[0]

    similarity = cosine_similarity([current_encoded_messages], [past_encoded_messages])[0][0]
    print(f"Pattern Noise Similarity Score: {similarity}")

    for msg in past_messages:
        print("Past noise value:", msg.get("detected_noise", []))

    past_has_bias = any(
        bias for msg in past_messages for bias in msg.get("detected_bias", []) if bias and bias != "None"
    )
    past_has_noise = any(
        noise for msg in past_messages for noise in msg.get("detected_noise", []) if noise and noise != "None"
    )

    current_has_bias = any(
        bias for msg in current_messages for bias in msg.get("detected_bias", []) if bias and bias != "None"
    )
    current_has_noise = any(
        noise for msg in current_messages for noise in msg.get("detected_noise", []) if noise and noise != "None"
    )

    if similarity > 0.5 and not past_has_bias and not past_has_noise and (current_has_bias or current_has_noise):
        print("Pattern Noise Detected!")
        return True

    return False
