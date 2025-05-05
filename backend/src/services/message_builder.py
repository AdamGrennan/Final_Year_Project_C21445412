
class MessageBuilder:
    def __init__(self, name, title, situation, chat_instruction):
        self.name = name
        self.title = title
        self.situation = situation
        self.chat_instruction = chat_instruction
        self.messages = []

    def build_open_message(self):
        self.messages.append({
        "role": "system",
        "content": (
            f"You are SONUS, an assistant helping users reflect on decisions. "
            f"User {self.name} is considering a decision titled '{self.title} with situation '{self.situation}'. "
            f"Start the conversation in a warm, conversational tone. "
            f"Do not use bullet points. Instead, ask the user casually what their initial thoughts or feelings are. "
            f"Keep it light — you're here to guide reflection, not evaluate."
        )
    })

    def build_system_message(self, detectedBias, detectedNoise, pattern_context, recencyInfo):
        lines = [
        "You are SONUS, a conversational assistant helping users reflect on decisions.",
        "You respond in a warm, natural tone and help the user think critically about their choices.",
        "Your advice should be thoughtful, use bullet points with '- ', and include light emojis at the end of your response if appropriate.",
        ]
        
        if recencyInfo:
            lines.append(
            f"The user recently read a news article titled **'{recencyInfo}'**. "
            "You **must explicitly reference this article** in your first paragraph and explore whether it could be contributing to Recency Bias. "
            "Make it clear that recent news may be affecting their current perspective more than past long-term evidence."
         )

        if detectedBias or detectedNoise:
            all_influences = ", ".join(detectedBias + detectedNoise)
            lines.append(f"The user may be influenced by the following: {all_influences}.")
            lines.append("Explain these clearly and help them reflect without being judgmental.")

        if pattern_context:
            previous_title = pattern_context.get("title", "").strip()
            previous_summary = pattern_context.get("summary", "").strip()

            lines.append(
            f"The user has previously made a similar decision titled '{previous_title}'. "
            "You **must mention this previous decision** and highlight if there are inconsistencies. "
            "Encourage the user to reflect on what’s changed and whether the change is meaningful."
            )
            if previous_summary:
                lines.append(f"Summary of that decision: {previous_summary}")

        if self.chat_instruction:
            lines.append(f"Additional instruction: {self.chat_instruction}")

        self.messages.append({
        "role": "system",
        "content": "\n".join(lines).strip()
        })

    def build_context_message(self, context):
        def get_created_at(chat):
            return chat.get("createdAt", float("-inf"))
        
        if context:
            sorted_context = sorted(context, key=get_created_at)
            for chat in sorted_context:
                sender = chat.get("sender", "Unknown")
                past_message = chat.get("text", "").strip()
                if not past_message:
                    continue
                role = "assistant" if sender == "GPT" else "user"
                self.messages.append({"role": role, "content": past_message})

    def build_user_response(self, statement, last_system_message):
        if statement:
            if last_system_message:
                statement = f"User follows up: {statement} (This is in response to: '{last_system_message}')"
                self.messages.append({
                    "role": "system",
                    "content": f"Reminder: The user's last message is a direct response to your previous answer: '{last_system_message}'."
                })
            else:
                statement = f"User states: {statement}"

            self.messages.append({"role": "user", "content": statement})
        

    def get_messages(self):
        return self.messages
