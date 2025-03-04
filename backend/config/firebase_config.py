import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate('config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()