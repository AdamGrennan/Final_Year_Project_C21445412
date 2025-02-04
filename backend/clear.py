import firebase_admin
from firebase_admin import credentials, firestore

# 🔹 Initialize Firebase
cred = credentials.Certificate("config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json")  # Update this with your JSON key file
firebase_admin.initialize_app(cred)

db = firestore.client()

# 🔹 Function to Delete 100 Chats
def delete_chats(limit=300):
    try:
        chat_ref = db.collection("chat")  # 🔹 Reference to 'chat' collection
        chats = chat_ref.limit(limit).stream()  # 🔹 Fetch first 100 chats
        
        count = 0
        for chat in chats:
            db.collection("chat").document(chat.id).delete()
            count += 1
            print(f"Deleted Chat: {chat.id}")

        print(f"\n✅ Successfully deleted {count} chat messages from Firestore.")

    except Exception as e:
        print(f"❌ Error deleting chats: {e}")

# Run the delete function
delete_chats()
