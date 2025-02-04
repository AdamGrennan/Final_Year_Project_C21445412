from flask import request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
from src.api.source import source_endpoint

MAX_DECISIONS = 3

def pattern_noise_endpoint(sbert_model, db, threshold=0.7):
    data = request.json
    user_id = data.get("user_id")
    judgment_id = data.get("judgmentId")
    theme = data.get("theme")

    decisionDetails = fetch_decisions(user_id, db)

    past_decisions = []
    for j in decisionDetails:
        if j["judgmentId"] != judgment_id:
            past_decisions.append(j)

    if not past_decisions:
        return jsonify({
            "similarDecisions": [],
            "patternNoiseSources": [],
        })

    encoded_current_decision = sbert_model.encode([theme]).reshape(1, -1)

    past_decisions_text = []
    for d in past_decisions:
        past_decisions_text.append(d["theme"])

    encoded_past_decisions = sbert_model.encode(past_decisions_text)

    similarities = cosine_similarity(encoded_current_decision, encoded_past_decisions)[0]

    similar_decisions = []
    for i, score in enumerate(similarities):
        if score > threshold:
            decision = past_decisions[i]
            similar_decisions.append({
                "judgmentId": decision["judgmentId"],
                "theme": decision["theme"],
                "createdAt": decision["createdAt"],
                "detectedBias": decision["detectedBias"],
                "detectedNoise": decision["detectedNoise"],
                "similarity": score,
            })

    similar_decisions.sort(key=lambda x: x["similarity"], reverse=True)
    similar_decisions = similar_decisions[:MAX_DECISIONS]

    current_chat_messages = fetch_chats(judgment_id, db)
    
    pattern_noise_sources = []
    for decision in similar_decisions:
        past_chat_messages = fetch_chats(decision["judgmentId"], db)
        detected_noise = compare_chat_messages(current_chat_messages, past_chat_messages, sbert_model)

        if detected_noise:
            pattern_noise_sources.append({
                "judgmentId": decision["judgmentId"],
                "theme": decision["theme"],
                "source": detected_noise[:2]
            })

    insights = {
        "similarDecisions": similar_decisions,
        "patternNoiseSources": pattern_noise_sources
    }

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


def fetch_chats(judgment_id, db):
    chat_ref = db.collection("chat").where("judgmentId", "==", judgment_id)
    docs = chat_ref.stream()

    messages = []
    for doc in docs:
        data = doc.to_dict()
        if data:
            messages.append({
                "text": data.get("text", ""),
                "detected_bias": data.get("detectedBias", []),
                "detected_noise": data.get("detectedNoise", []),
            })
    return messages

def compare_chat_messages(current_messages, past_messages, sbert_model):
    pattern_noise = []
    for current_msg in current_messages:
        for past_msg in past_messages:
            similarity_score = cosine_similarity(
                sbert_model.encode([current_msg["text"]]).reshape(1, -1),
                sbert_model.encode([past_msg["text"]]).reshape(1, -1)
            )[0][0]


    return pattern_noise
