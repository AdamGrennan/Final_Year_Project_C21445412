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
        A user made a decision titled **"{decision_title}"**, and the following bias was detected: **{bias}**.
        Their reasoning: "{context}".
        Provide **one paragraph** of **specific, practical** advice to help them **reduce {bias}** in similar decisions.
        Keep it clear, structured, and avoid lists.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You provide structured, paragraph-style advice to help users reduce biases and noise."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=100,  
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
         A user made a decision titled **"{decision_title}"**, and the following type of noise was detected: **{noise}**.
        Their reasoning: "{context}".
        Explain in **one paragraph** how {noise} affects their judgment and provide one clear, actionable strategy to reduce its impact in future decisions.
        Avoid lists; structure it as a flowing explanation.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You provide structured, paragraph-style explanations of noise and strategies to mitigate it."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=100,  
                temperature=0.5
            )

            advice = response.choices[0].message.content.strip()
            advice_responses[noise] = advice

        except Exception as e:
            print(f"GPT Error for {noise}:", e)
            advice_responses[noise] = "Error generating advice."

    return jsonify({"advice": advice_responses})
