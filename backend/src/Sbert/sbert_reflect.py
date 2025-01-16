from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def fetch_judgements(user_id, db):
    judge_ref = db.collection("judgement").where("userId", "==", user_id )
    docs = judge_ref.stream()
    
    judgements = []
    for doc in docs:
        data = doc.to_dict()
        judgements.append({
            "breakdown": data.get("breakdown", ""),
            "biases": data.get("biases", []),
            "noise": data.get("noise", []),
        })
        
    return judgements

def reflect_judgements(user_id, current_breakdown, db, threshold=0.7):
    judgements = fetch_judgements(user_id, db)
    breakdowns = [j['breakdown'] for j in judgements]

    current_judgement = model.encode(current_breakdown)
    past_judgement = model.encode(breakdowns)

    similarities = model.similarity(current_judgement, past_judgement)

    similar_judgments = []
    for i, score in enumerate(similarities[0]):
        if score > threshold:
            similar_judgments.append({
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