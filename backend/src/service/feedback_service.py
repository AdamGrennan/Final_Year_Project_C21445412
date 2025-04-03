from firebase_admin import firestore

class FeedbackService:
 def __init__(self):
        self.db = firestore.client()
        
def fetch_feedback(self, user_id):
     feedback_ref = self.db.collection('feedback')
     query = (
        feedback_ref
        .where('userId', '==', user_id)
        .order_by('createdAt', direction=firestore.Query.DESCENDING)
        .limit(1)
        .stream()
    )

     feedback_entries = [doc.to_dict() for doc in query]
     return feedback_entries
    
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
        last_reply = next(
            (chat.get("text") for chat in reversed(previous_chats) if chat.get("sender") == "GPT" and chat.get("text")),
            None
        )
        if last_reply:
            snippet = last_reply.strip().replace("\n", " ")
            snippet = snippet[:117] + "..." if len(snippet) > 120 else snippet
            parts.append(f'Last time, you said: "{snippet}". Consider improving clarity or tone based on feedback.')

    return " ".join(parts)
