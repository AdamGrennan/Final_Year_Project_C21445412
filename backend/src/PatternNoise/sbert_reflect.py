from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def fetch_judgements(user_id, db):
    judge_ref = db.collection("judgement").where("userId", "==", user_id )
    docs = judge_ref.stream()
    
    judgements = []
    for doc in docs:
        data = doc.to_dict()
        judgements.append({
            "title": data.get("title", ""),
            "createdAt": data.get("createdAt", ""),
            "breakdown": data.get("breakdown", ""),
            "biases": data.get("detectedBias", []),
            "noise": data.get("detectedNoise", []),
        })
        
    return judgements

def reflect_judgements(user_id, judgment_id, current_breakdown, detected_bias, detected_noise, db, threshold=0.75):
    judgementsDetails = fetch_judgements(user_id, db)
    
    judgements = []
    for j in judgementsDetails:
        if j["id"] != judgment_id:
            judgements.append(j)
    
    breakdowns = [j['breakdown'] for j in judgements]

    current_judgement = model.encode(current_breakdown)
    
    if len(current_judgement.shape) == 1:
        current_judgement = current_judgement.reshape(1, -1)
    past_judgement = model.encode(breakdowns)

    similarities = cosine_similarity(current_judgement, past_judgement)

    similar_judgments = []
    for i, score in enumerate(similarities[0]):
        if score > threshold:
            similar_judgments.append({
                "title": judgements[i].get("title"),
                "createdAt": judgements[i].get("createdAt"),
                "breakdown": breakdowns[i],
                "similarity": score.item(),
                "biases": judgements[i]["biases"],
                "noise": judgements[i]["noise"],
            })

    trends = analyze_judgements(judgements)

    insights = {
        "similarJudgments": similar_judgments,
        "trends": trends
    }

    return insights
    
def analyze_judgements(judgements):
    from collections import Counter

    biases = []
    for judgment in judgements:
     for bias in judgment['biases']:
        biases.append(bias)


    bias_count = Counter(biases)

    return {
        "mostFrequentBiases": bias_count.most_common(),
    }