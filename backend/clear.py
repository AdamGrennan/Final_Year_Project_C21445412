import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def delete_all_docs_from_level_noise_average():
    collection_ref = db.collection('level_noise_average')
    docs = collection_ref.stream()

    deleted = 0
    for doc in docs:
        doc.reference.delete()
        deleted += 1

    print(f'Deleted {deleted} documents from level_noise_average.')

delete_all_docs_from_level_noise_average()
