from firebase_admin import firestore

class FeedbackService:
    def __init__(self):
        self.db = firestore.client()

    def fetch_feedback(self, user_id, decision_id):
        feedback_ref = self.db.collection('feedback')
        query = feedback_ref.where('userId', '==', user_id).where('decisionId', '==', decision_id).stream()

        feedback_entries = []
        for doc in query:
            feedback_entries.append(doc.to_dict())
        return feedback_entries

    def generate_instruction(self, feedback_entries):
        if not feedback_entries:
            return "No prior feedback. Proceed as usual."

        feedback = feedback_entries[-1]
        helpful = feedback.get("helpful", "").lower()
        perspective_changed = feedback.get("perspectiveChanged", "").lower()

        instruction = ""

        if helpful == "no":
            instruction += (
                "The user did not find the previous interaction helpful. "
                "Be more direct, actionable, and try to provide clearer steps or advice this time. "
            )
        elif helpful == "somewhat":
            instruction += (
                "The user found the previous interaction somewhat helpful. "
                "Probe them more to understand their uncertainties and offer clearer clarifications. "
            )
        elif helpful == "yes":
            instruction += (
                "The user found the previous interaction helpful. Continue with a similar conversational tone. "
            )

        if perspective_changed == "no":
            instruction += (
                "The user's perspective did not change last time. Challenge their assumptions more assertively if appropriate. "
            )
        elif perspective_changed == "unsure":
            instruction += (
                "The user was unsure if their perspective changed. Encourage them to explore alternative viewpoints gently. "
            )
        elif perspective_changed == "yes":
            instruction += (
                "The user felt their perspective changed positively. Reinforce this reflection in your response."
            )

        return instruction
