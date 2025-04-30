from firebase_admin import firestore

class FeedbackService:
    def __init__(self):
        self.db = firestore.client()
        
    def fetch_feedback(self, user_id):
        feedback_ref = self.db.collection('feedback')
        query = (
            feedback_ref
            .where('userId', '==', user_id)
            .where('usedInNextChat', '==', False)
            .order_by('createdAt', direction=firestore.Query.DESCENDING)
            .limit(1)
            .stream()
        )
        feedback_entries = [{"id": doc.id, **doc.to_dict()} for doc in query]
        print(f"FEEDBACK SERVICE: Fetched feedback for user {user_id}: {feedback_entries}")
        return feedback_entries

    def mark_feedback(self, doc_id):
        print(f"FEEDBACK SERVICE: Marking feedback {doc_id} as used")
        feedback_ref = self.db.collection('feedback').document(doc_id)
        feedback_ref.update({"usedInNextChat": True})   

    def fetch_chats_for_decision(self, user_id, decision_id):
        if not decision_id:
            return []

        chats_ref = self.db.collection('chat')
        query = (
            chats_ref
            .where('userId', '==', user_id)
            .where('judgementId', '==', decision_id)
            .stream()
        )

        return [doc.to_dict() for doc in query]

    def generate_instruction(self, feedback_entries, previous_chats=None):
        if not feedback_entries:
            return "No prior feedback. Proceed as usual."

        feedback = feedback_entries[-1]
        helpful = feedback.get("helpful", "").lower()
        perspective = feedback.get("perspectiveChanged", "").lower()

        parts = []

        if helpful == "no":
            parts.append("Last chat wasn’t helpful — give clearer, more direct advice.")
        elif helpful == "somewhat":
            parts.append("User found it somewhat helpful — try to clarify things more.")
        elif helpful == "yes":
            parts.append("Last chat was helpful — keep a similar tone.")

        if perspective == "no":
            parts.append("Their perspective didn’t change — challenge assumptions if needed.")
        elif perspective == "unsure":
            parts.append("They were unsure if their view changed — offer new angles gently.")
        elif perspective == "yes":
            parts.append("Their perspective changed — reinforce helpful reflection.")

        if previous_chats:
            conversation = []
            for chat in previous_chats:
                sender = chat.get("sender")
                text = chat.get("text", "").strip()
                if text:
                    conversation.append(f"{sender}: {text}")

        conversation_text = " ".join(conversation)
        parts.append(f"Here's the conversation so far: {conversation_text}. Adjust tone and style based on this and feedback.")
        return " ".join(parts)
