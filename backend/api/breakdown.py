from flask import request, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import openai

cred = credentials.Certificate('config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

def breakdown_endpoint():
    try:
        data = request.json
        judgment_id = data.get("judgementId")
        
        judge_ref = db.collection("judgement").document(judgment_id)
        judgment = judge_ref.get().to_dict()
        
        if not judgment:
            return jsonify({"error": "Judgment not found"}), 500
        
        chat_ref = db.collection("chat").where("judgementId", "==", judgment_id)
        chats = chat_ref.stream()
        for chat in chats:
            chat.to_dict() 
        
   
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant generating a decision breakdown. "
                )
            },
            {
                "role": "user",
                "content": (
                    f"Here is the conversation\n"
                    f"Here is the detected biases and noises\"{}\"\n"
                    "Generate a concise breakdown of the decision, focusing on key factors, biases, noise."
                )
            }
        ]
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=250,
            temperature=0.7
        )
         
        breakdown = response.choices[0].message['content'].strip()
        
        judge_ref.update({"breakdown":breakdown})

    
    
    except Exception as e:
        print(f"Unhandled exception: {e}")
        return jsonify({"error": str(e)}), 500