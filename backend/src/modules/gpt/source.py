from flask import request, jsonify

def source_endpoint(client):
    data = request.json
    message = data.get('message', "")
    detected_bias = data.get('detectedBias', [])
    detected_noise = data.get('detectedNoise', [])

    if not message:
        return jsonify({"error": "Invalid request data"}), 400

    summary = {}

    if detected_noise:
        noise_prompt = f"""
        A user wrote the following message: "{message}"
        One or more types of judgment noise were detected.
        Identify where this occurred and return a short, natural explanation of what the user said — something that caused variability in judgment (e.g., conditions, vague language, emotional state).
        Return only a short sentence like: "Detected on your reference to your current situation" or "Detected on your uncertain phrasing."
        Avoid using the same structure every time.
        """

        try:
            noise_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Summarize the user's noisy expression into a short, natural-sounding explanation. Don't repeat templates."
                    },
                    {
                        "role": "user",
                        "content": noise_prompt
                    }
                ],
                max_tokens=30,
                temperature=0.5
            )
            summary["noise_summary"] = noise_response.choices[0].message.content.strip().strip('"')
        except Exception as e:
            print("Noise Source Error:", e)
            summary["noise_summary"] = "Noise detected but source could not be generated."

    if detected_bias:
        bias_prompt = f"""
        A user wrote the following message: "{message}"
        One or more types of bias were detected in this message.
        Identify the section of the message that shows bias and express it as a short, natural explanation of what the user said — for example, a strong opinion, assumption, or favoritism.
        Return a brief sentence like: "Detected on your preference for directness" or "Based on your favorable comment about one side."
        Use varied phrasing.
        """

        try:
            bias_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Rephrase the biased expression in the message as a short, natural description of what the user conveyed. Vary your language across responses."
                    },
                    {
                        "role": "user",
                        "content": bias_prompt
                    }
                ],
                max_tokens=30,
                temperature=0.5
            )
            summary["bias_summary"] = bias_response.choices[0].message.content.strip().strip('"')
        except Exception as e:
            print("Bias Source Error:", e)
            summary["bias_summary"] = "Bias detected but source could not be generated."

    return jsonify(summary)
