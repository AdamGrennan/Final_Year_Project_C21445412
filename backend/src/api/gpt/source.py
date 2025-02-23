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
        Provide a **very short source** where the noise is detected. 
        Keep it under 10 words.
        Message: "{message}"
        """

        try:
            noise_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You generate **very short, precise noise sources**."},
                    {"role": "user", "content": noise_prompt}
                ],
                max_tokens=15,  
                temperature=0.4
            )
            summary["noise_summary"] = noise_response.choices[0].message.content.strip().strip('"')
        except Exception as e:
            print("Noise Source Error:", e)
            summary["noise_summary"] = "Noise detected but source could not be generated."

    if detected_bias:
        bias_prompt = f"""
        Provide a **very short phrase** where this bias appears. 
        Keep it under 10 words.
        Message: "{message}"
        """

        try:
            bias_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You generate **very short bias sources**."},
                    {"role": "user", "content": bias_prompt}
                ],
                max_tokens=15,  
                temperature=0.4  
            )
            summary["bias_summary"] = bias_response.choices[0].message.content.strip().strip('"')
        except Exception as e:
            print("Bias Source Error:", e)
            summary["bias_summary"] = "Bias detected but source could not be generated."

    return jsonify(summary)
