import os, json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

def initialize_firebase():
    if not firebase_admin._apps:
        key_data = os.getenv("FIREBASE_KEY")
        cred = credentials.Certificate(json.loads(key_data))
        firebase_admin.initialize_app(cred)
    return firestore.client()
