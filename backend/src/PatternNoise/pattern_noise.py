from flask import request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter

MAX_DECISIONS = 3

def pattern_noise_endpoint(sbert_model, db, threshold=0.7):
    data = request.json
    print("Incoming Data:", data)

    user_id = data.get("user_id")
    judgment_id = data.get("judgmentId")

    decisionDetails = fetch_judgements(user_id, db)

    # Remove the current judgment from past decisions
    past_decisions = []
    for j in decisionDetails:
     if j["judgmentId"] != judgment_id:
        past_decisions.append(j)

    # If there are no past decisions, return early
    if not past_decisions:
        return jsonify({"similarDecisions": [], "trends": {}, "pattern_noise_percentage": 0})

    current_decision = {
        "title": data.get("title"),
        "description": data.get("description"),
        "theme": data.get("theme"),
        "breakdown": data.get("breakdown"),
        "detected_bias": data.get("detectedBias", []),
        "detected_noise": data.get("detectedNoise", []),
    }

    # Encode decisions
  # Convert the current decision to a string and encode it
    current_decision_text = str(current_decision)
    encoded_current_decision = sbert_model.encode([current_decision_text]).reshape(1, -1)

# Convert each past decision to a string and encode them
    past_decisions_text = [str(d) for d in past_decisions]
    encoded_past_decisions = sbert_model.encode(past_decisions_text)

    # Compute similarities
    similarities = cosine_similarity(encoded_current_decision, encoded_past_decisions)[0]

    # Filter decisions above threshold and sort them
    similar_decisions = []

# Loop through past decisions and their similarity scores
    for i, score in enumerate(similarities):
     if score > threshold:
        decision = {
            "title": past_decisions[i]["title"],
            "createdAt": past_decisions[i]["createdAt"],
            "breakdown": past_decisions[i]["breakdown"],
            "detectedBias": past_decisions[i]["detectedBias"],
            "detectedNoise": past_decisions[i]["detectedNoise"],
            "similarity": score,
        }
        similar_decisions.append(decision)

# Sort the list by similarity score in descending order
    similar_decisions.sort(key=lambda x: x["similarity"], reverse=True)

# Keep only the top MAX_DECISIONS
    similar_decisions = similar_decisions[:MAX_DECISIONS]


    # Calculate pattern noise percentage
    pattern_noise_score = 0

# Calculate the total similarity score
    for d in similar_decisions:
        pattern_noise_score += d["similarity"]

# Avoid division by zero
    if len(similar_decisions) > 0:
        pattern_noise_percentage = (pattern_noise_score / len(similar_decisions)) * 100
    else:
        pattern_noise_percentage = 0


    insights = {
        "similarDecisions": similar_decisions,
        "trends": analyze_judgements(past_decisions),
        "pattern_noise_percentage": round(pattern_noise_percentage, 2),
    }

    print("Pattern Noise Percentage:", insights["pattern_noise_percentage"])
    return jsonify(insights)

def fetch_judgements(user_id, db):
    judge_ref = db.collection("judgement").where("userId", "==", user_id)
    docs = judge_ref.stream()

    decisions = []

    for doc in docs:
        data = doc.to_dict()  # Convert Firestore document to dictionary
        if data:  # Ensure data exists
            decisions.append({
                "judgmentId": doc.id,
                "title": data.get("title", ""),
                "description": data.get("description", ""),
                "theme": data.get("theme", ""),
                "createdAt": data.get("createdAt", ""),
                "breakdown": data.get("breakdown", ""),
                "detectedBias": data.get("detectedBias", []),
                "detectedNoise": data.get("detectedNoise", []),
            })

    return decisions


def analyze_judgements(judgements):
    biases, noises = [], []
    for judgment in judgements:
        biases.extend(judgment["detectedBias"])
        noises.extend(judgment["detectedNoise"])

    return {
        "mostFrequentBiases": Counter(biases).most_common(),
        "mostFrequentNoise": Counter(noises).most_common(),
    }
