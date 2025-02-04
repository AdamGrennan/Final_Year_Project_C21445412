from flask import request, jsonify
from openai import OpenAI

client = OpenAI(api_key="sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA")

def source_endpoint():
    data = request.json
    message = data.get('message')
    detected_bias = data.get('biases', [])

    if not message:
        return jsonify({"error": "Invalid request data"}), 400
    
    print("SUMMARY", detected_bias)

    prompt = f"""
    Summarize the following message in a short, clear identifier (5-6 words max) that explains where the detected biases ({', '.join(detected_bias)}) were identified:
    Message: "{message}"
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant that summarizes messages concisely."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10, 
            temperature=0.5  
        )
        
        summary = response.choices[0].message.content.strip()
        return jsonify({"summary": summary})
    except Exception as e:
        print("GPT Summarization Error:", e)
        return jsonify({"error": "Failed to summarize message."}), 500
