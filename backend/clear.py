import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate('./config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')  # Replace with your actual key file
firebase_admin.initialize_app(cred)

# Get Firestore reference
db = firestore.client()

def delete_chats(limit=100):
    chat_ref = db.collection("chat")  # Reference to the 'chat' collection
    docs = chat_ref.limit(limit).stream()  # Retrieve 100 chats

    deleted_count = 0
    for doc in docs:
        print(f"Deleting chat: {doc.id}")
        doc.reference.delete()
        deleted_count += 1

    print(f"Deleted {deleted_count} chats from Firestore.")

if __name__ == "__main__":
    delete_chats()
