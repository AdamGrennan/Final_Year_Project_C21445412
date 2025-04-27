from modules.gpt.prompts import get_opening_message
from modules.gpt.prompts import get_opening_message, get_system_prompt

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
            "content": get_opening_message(self.name, self.title)
        })

    def build_noise_bias_message(self, detectedBias, detectedNoise):
        if detectedBias or detectedNoise:
            bias_noise = ""
            if detectedBias:
                bias_noise += f" biases {', '.join(detectedBias)}"
            if detectedNoise:
                if bias_noise:
                    bias_noise += " and"
                bias_noise += f" noise factors {', '.join(detectedNoise)}"

            self.messages.append({
                "role": "system",
                "content": (
                    f"Reminder: User {self.name}'s latest decision may involve{bias_noise}. "
                    "Encourage reflection without assuming error."
                )
            })

    def build_system_message(self):
        self.messages.append({
            "role": "system",
            "content": get_system_prompt(
                self.name, self.title, self.situation, self.chat_instruction
            )
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
            
    def build_prompt_suggestions(self):
        self.messages.append({
            "role": "system",
            "content": (
                "**IMPORTANT**: After giving your main advice, you MUST suggest exactly 3 next steps the user could take."
                "\n\nList them clearly like this:"
                "\n1. [First suggestion]"
                "\n2. [Second suggestion]"
                "\n3. [Third suggestion]"
                "\n\nMake sure to number them exactly. Do not skip this step."
            )
        })

        
    def build_recency_message(self, recencyInfo):
        if recencyInfo:
            self.messages.append({
            "role": "system",
            "content": (
                f"Note: The user may have recently read an article titled '{recencyInfo}'. "
                "Consider mentioning gently that recent news could affect decision-making. "
                "Do not accuse just reflect and encourage thoughtful consideration."
            )
        })

    def get_messages(self):
        return self.messages
