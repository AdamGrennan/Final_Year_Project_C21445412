from sklearn.metrics.pairwise import cosine_similarity
from config.firebase_config import initialize_firebase
import requests

class PatternNoiseService:
    def __init__(self):
        self.db = initialize_firebase()

    def fetch_chats(self, user_id):
        chat_ref = self.db.collection("chat").where("userId", "==", user_id).where("sender", "==", "user")
        docs = chat_ref.stream()

        messages = []
        for doc in docs:
            data = doc.to_dict()
            judgment_id = data.get("judgementId", "")
            
            title = ""
            if judgment_id:
                judgment_doc = self.db.collection("judgement").document(judgment_id).get()
                if judgment_doc.exists:
                    title = judgment_doc.to_dict().get("title", "")
            
            if data:
                messages.append({
                "text": data.get("text", ""),
                "judgementId": data.get("judgementId", ""),
                "detected_bias": data.get("detectedBias", []),
                "detected_noise": data.get("detectedNoise", []),
                "title": title
            })

        print(f"Retrieved {len(messages)} total chat messages for user {user_id}")
        return messages
    
        
    def is_pattern_noise(self, current_messages, past_messages, sbert_model):
        current_texts = current_messages[-1]["text"] 
        past_texts = " | ".join([msg["text"] for msg in past_messages[-5:]])

        if not current_texts or not past_texts:
            print("Not enough chat messages for comparison")
            return False

        current_encoded_messages = sbert_model.encode([current_texts])[0]
        past_encoded_messages = sbert_model.encode([past_texts])[0]

        similarity = cosine_similarity([current_encoded_messages], [past_encoded_messages])[0][0]
        print(f"Pattern Noise Similarity Score: {similarity:.2f}")

        for msg in past_messages:
            print("Past message noise:", msg.get("detected_noise", []))
            print("Past message bias:", msg.get("detected_bias", []))

        past_has_bias = any(
            bias for msg in past_messages for bias in msg.get("detected_bias", []) if bias and bias.lower() != "none"
        )
        past_has_noise = any(
            noise for msg in past_messages for noise in msg.get("detected_noise", []) if noise and noise.lower() != "none"
        )

        current_has_bias = any(
            bias for msg in current_messages for bias in msg.get("detected_bias", []) if bias and bias.lower() != "none"
        )
        current_has_noise = any(
            noise for msg in current_messages for noise in msg.get("detected_noise", []) if noise and noise.lower() != "none"
        )

        print(f"Past has bias: {past_has_bias}, Past has noise: {past_has_noise}")
        print(f"Current has bias: {current_has_bias}, Current has noise: {current_has_noise}")

        if similarity > 0.3 and not past_has_bias and not past_has_noise and (current_has_bias or current_has_noise):
            print("Pattern Noise Detected!")
            return True

        print("No Pattern Noise Detected.")
        return False
