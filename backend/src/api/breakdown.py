from flask import request, jsonify
import openai

openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

def breakdown_endpoint(db):
    try:
        data = request.json
        print("Received Request Data:", data)
        
        judgmentId  = data.get("judgementId")
        if not judgmentId:
            print("Error: 'judgementId' missing from request.")
            return jsonify({"error": "Missing 'judgementId'"}), 400

        print(f"Fetching judgment with ID: {judgmentId}")
        judge_ref = db.collection("judgement").document(judgmentId)
        judgment = judge_ref.get().to_dict()
        
        if not judgment:
            print(f"Error: Judgment with ID '{judgmentId}' not found.")
            return jsonify({"error": "Judgment not found"}), 404
        print("Fetched Judgment Data:", judgment)

        bias = judgment.get("detectedBias", [])
        noise = judgment.get("detectedNoise", [])
        detected_bias = ", ".join(bias) if bias else "No bias detected"
        detected_noise = ", ".join(noise) if noise else "No noise detected"
        print(f"Detected Biases: {detected_bias}, Detected Noise: {detected_noise}")

        print(f"Fetching chats associated with Judgment ID: {judgmentId}")
        chat_ref = (
            db.collection("chat")
            .where("judgementId", "==", judgmentId)
            .order_by("createdAt")
        )
        chats = chat_ref.stream()

        chat_data = []
        for chat in chats:
            chat_dict = chat.to_dict()
            chat_content = chat_dict.get("content", "")
            chat_data.append(chat_content)
        print(f"Fetched Chats: {chat_data}")

        conversation = "\n".join(chat_data)
        print("Compiled Conversation for GPT:", conversation)

        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant generating a decision breakdown.",
            },
            {
                "role": "user",
                "content": (
                    f"Here is the conversation: \"{conversation}\"\n"
                    f"Here are the detected biases: \"{detected_bias}\"\n"
                    f"Here are the detected noise types: \"{detected_noise}\"\n"
                    "Generate a concise breakdown of the decision, focusing on key factors, biases, and noise."
                ),
            },
        ]
        print("Sending GPT Request with Messages:", messages)

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=250,
            temperature=0.7,
        )
        breakdown = response.choices[0].message['content'].strip()
        print("Generated Breakdown from GPT:", breakdown)
        
        print(f"Updating Judgment ID '{judgmentId}' with Breakdown.")
        judge_ref.update({"breakdown": breakdown})

        return jsonify({"breakdown": breakdown})

    except Exception as e:
        print(f"Unhandled exception in breakdown_endpoint: {e}")
        return jsonify({"error": str(e)}), 500
