from firebase_admin import firestore

class LevelNoiseService:
    def __init__(self):
        self.db = firestore.client()
        
    def save_level_score(self, user_id, average_score):
        noise_ref = self.db.collection('level_noise_average')
        noise_ref.add({
        'userId': user_id,
        'average_score': average_score,
        'timestamp': firestore.SERVER_TIMESTAMP
            })

    def fetch_level_scores(self, user_id, limit=20):
        noise_ref = self.db.collection('level_noise_average')
        docs = noise_ref\
             .where("userId", "==", user_id) \
             .order_by("timestamp", direction=firestore.Query.DESCENDING) \
             .limit(limit).stream()
        return [doc.to_dict()["score"] for doc in docs]
