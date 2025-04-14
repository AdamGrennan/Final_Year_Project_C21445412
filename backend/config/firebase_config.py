import os
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    if not firebase_admin._apps:
        current_dir = os.path.dirname(__file__)
        json_path = os.path.join(current_dir, "finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json")
        cred = credentials.Certificate(json_path)
        firebase_admin.initialize_app(cred)
    return firestore.client()
