
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


    def build_system_message(self, detectedBias, detectedNoise):
        base_prompt = (
             "You are SONUS, a conversational assistant helping users reflect on decisions. "
             "Focus on being helpful, natural, and open-ended. "
             "Feel free to use light, appropriate emojis to reinforce tone — especially at the end of a message."
        )
        if detectedBias and detectedNoise:
            context_info = (
            f"The user might be influenced by {', '.join(detectedBias)} and {', '.join(detectedNoise)}. "
                "Gently help them reflect on this without being heavy-handed. "
                "Present your key points using bullet points that start with '- ' and use line breaks (\\n) between each point.")
        elif detectedBias:
            context_info = (
            f"The user might be influenced by {', '.join(detectedBias)}. "
                "Gently help them reflect on this without being heavy-handed. "
                "Present your key points using bullet points that start with '- ' and use line breaks (\\n) between each point.")
        elif detectedNoise:
            context_info = (
            f"The user might be influenced by {', '.join(detectedNoise)}. "
                "Gently help them reflect on this without being heavy-handed. "
                "Present your key points using bullet points that start with '- ' and use line breaks (\\n) between each point.")
        else:
            context_info = (
                "Assist the user in thinking through their decision naturally. "
                "Start with a short one-line summary. "
                "Then, present your key points using bullet points that start with '- ' and use line breaks (\\n) between each point. "
                "Each bullet should be on a new line. "
                "Avoid long paragraphs. "
                "End with a helpful or reflective sentence if appropriate.")
            
        if self.chat_instruction:
            extra_hint = f"Additional hint: {self.chat_instruction}"
        else:
            extra_hint = ""

        final_prompt = base_prompt + context_info + " " + extra_hint

        self.messages.append({
        "role": "system",
        "content": final_prompt.strip()
            })

    def build_pattern_message(self, pattern_context):
        if pattern_context:
            previous_title = pattern_context.get("title", "")
            previous_summary = pattern_context.get("summary", "")
            self.messages.append({
                "role": "system",
                "content": (
                    f"The user {self.name} previously made a similar decision titled '{previous_title}'. "
                    f"Here’s a summary of that decision: '{previous_summary}'. "
                    "Use this to tailor your response and encourage reflection."
                )
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
     
    def build_recency_message(self, recencyInfo):
        if recencyInfo:
            short_title = recencyInfo.split(":")[0] if ":" in recencyInfo else recencyInfo.split(" ", 10)[0] + "..."
            self.messages.append({
            "role": "system",
            "content": (
                f"The user may have recently seen an article titled '{short_title}'. "
                "If it's relevant to their input, you can mention that recent information can sometimes influence decision-making more than older facts. "
                "Avoid assuming the user actually read or referenced this article."
            )
        })


    def get_messages(self):
        return self.messages
