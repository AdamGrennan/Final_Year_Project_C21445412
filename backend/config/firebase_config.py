import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    load_dotenv()
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH") 
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized")
    return firestore.client()
