from flask import request, jsonify

def chat_summary_endpoint(client):
    data = request.json
    title = data.get('title')
    theme = data.get('theme', "General") 
    messages = data.get('messages', [])
    detected_bias = data.get('detectedBias', []) or []
    detected_noise = data.get('detectedNoise', []) or []
    noise_sources = data.get('noiseSources', []) or []
    bias_sources = data.get('biasSources', []) or []
    
    if not messages or not isinstance(messages, list):
        return jsonify({"error": "Invalid request data: Messages must be a non-empty list"}), 400
    
    chat_summary_response = {}

    prompt = f"""
    The user has been making decisions in the theme of '{theme}'.
    Below is a summary of their decision-making process based on the following conversation.
    
    - **Title:** {title}
    - **Messages:** {messages}
    - **Detected Biases:** {", ".join(detected_bias) or "None"}
    - **Bias Sources:** {", ".join(bias_sources) or "Unknown"}
    - **Detected Noise:** {", ".join(detected_noise) or "None"}
    - **Noise Sources:** {", ".join(noise_sources) or "Unknown"}

    **Task:** Generate a summary highlighting key reasoning patterns, considerations, and any signs of bias or noise. 
    Ensure the summary is concise, neutral, and captures important insights.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Summarize decision-making processes based on user conversations, highlighting reasoning and detected biases/noise."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.4
        )
        chat_summary_response["chat_summary"] = response.choices[0].message.content.strip().strip('"') \
            if response and hasattr(response, 'choices') else "Summary could not be generated due to an error."
    except Exception as e:
        print(f"Chat Summary Error: {e}")
        chat_summary_response["chat_summary"] = "Summary could not be generated due to an error."

    return jsonify(chat_summary_response)
