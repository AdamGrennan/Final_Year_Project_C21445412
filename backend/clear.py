import firebase_admin
from firebase_admin import credentials, firestore

# Firestore client
db = firestore.client()

# Reference to 'trends' collection
trends_ref = db.collection('trends')

# Get all documents in the collection
docs = trends_ref.stream()

# Delete each document
deleted_count = 0
for doc in docs:
    doc.reference.delete()
    deleted_count += 1

print(f"Deleted {deleted_count} documents from 'trends' collection.")
