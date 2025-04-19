from config.firebase_config import initialize_firebase
from firebase_admin import firestore
from flask import jsonify

class LevelNoiseService:
    def __init__(self):
        self.db = initialize_firebase()

    def save_score(self, user_id, judgment_id, score, entry_type="message"):
        self.db.collection('level_noise').add({
            'userId': user_id,
            'judgmentId': judgment_id,
            'score': score,
            'type': entry_type,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        return jsonify({"Level Noise Service": "OK"}), 200

    def fetch_scores(self, user_id, entry_type="average", limit=20):
        docs = self.db.collection('level_noise')\
            .where("userId", "==", user_id)\
            .where("type", "==", entry_type)\
            .order_by("timestamp", direction=firestore.Query.DESCENDING)\
            .limit(limit).stream()

        return [doc.to_dict()["score"] for doc in docs]
