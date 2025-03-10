from flask import request, jsonify

def advice_endpoint(client):
    data = request.json
    messages = data.get('messages', [])
    decision_title = data.get('title', "this decision")
    detected_biases = data.get('detectedBias', [])
    detected_noise = data.get('detectedNoise', [])

    if not messages or (not detected_biases and not detected_noise):
        return jsonify({"error": "Invalid request data"}), 400

    context = "\n".join(
        [f"{msg['sender']}: {msg['text']}" for msg in messages]
    )

    advice_responses = {}

    for bias in detected_biases:
        prompt = f"""
        The user made a decision titled "**{decision_title}**", and the bias **{bias}** was detected in their reasoning.
        Conversation history: "**{context}**".
        
        Provide a **practical, actionable strategy** to counteract **{bias}** in this situation. Focus on **how they can adjust their thought process** next time to make a more balanced decision. 
        Avoid generic explanations—give a clear **solution** in one paragraph.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You provide direct, structured, and practical advice to help users mitigate bias."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,  
                temperature=0.5,
                stop=["\n"] 
            )

            advice = response.choices[0].message.content.strip()
            advice_responses[bias] = advice

        except Exception as e:
            print(f"GPT Error for {bias}:", e)
            advice_responses[bias] = "Error generating advice."

    for noise in detected_noise:
        prompt = f"""
        The user made a decision titled **"{decision_title}"**, and **{noise}** was detected as a source of judgment noise.
        Conversation history: "**{context}**".
        
        Suggest a **specific, immediate step** the user can take to reduce the impact of **{noise}** in similar decisions. Keep it **direct, situation-based, and immediately useful**.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You give actionable strategies to help users reduce judgment noise in their decisions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,  
                temperature=0.5
            )

            advice = response.choices[0].message.content.strip()
            advice_responses[noise] = advice

        except Exception as e:
            print(f"GPT Error for {noise}:", e)
            advice_responses[noise] = "Error generating advice."

    return jsonify({"advice": advice_responses})
