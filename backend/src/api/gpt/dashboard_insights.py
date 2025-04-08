from flask import request, jsonify

def dashboard_insights_endpoint(client):
    try:
        data = request.json
        decisions = data.get("decisions", [])
        #trends = data.get("trends", "")

        if not decisions:
            return jsonify({"error": "No decisions provided."}), 400

        prompt = (
            "You're SONUS, an intelligent assistant helping users reflect on judgment patterns.\n"
            "Below are 5 recent decisions the user made. Each decision includes a theme, context (situation, options, influences, goal), "
            "detected biases and noise, and a short system-generated insight.\n\n"
            "Your job is to analyze patterns and provide a reflection. Focus on recurring themes, decision tendencies, blind spots, and improvements.\n"
        )

        #if trends:
           # prompt += f"\nHere's a summary of recent trends across all decisions:\n{trends}\n\n"

        prompt += "Here are the 5 decisions:\n"

        for i, decision in enumerate(decisions, start=1):
            details = decision.get("details", {})
            
            biases = ', '.join(b.get("bias", "Unknown Bias") for b in decision.get("detectedBias", [])) or 'None'
            noise = ', '.join( n.get("noise", "Unknown Noise") for n in decision.get("detectedNoise", [])) or 'None'

            prompt += (
                f"\nDecision {i}:\n"
                f"Title: {decision.get('title', '—')}\n"
                f"Theme: {decision.get('theme', '—')}\n"
                f"Situation: {details.get('situation', '')}\n"
                f"Options: {details.get('options', '')}\n"
                f"Influences: {details.get('influences', '')}\n"
                f"Goal: {details.get('goal', '')}\n"
                f"Chat Summary: {details.get('chatSummary', '')}\n"
                f"Biases: {biases}\n"
                f"Noise: {noise}\n"
            )

        prompt += (
             "\nNow provide a short reflection in bullet points. Each bullet should focus on a key pattern, recurring issue, or suggestion. "
             "Be constructive and helpful. Keep it to 3–5 concise bullet points max."
            )


        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7,
        )

        insights = response.choices[0].message.content.strip()
        return jsonify({"insights": insights})

    except Exception as e:
        print("Error in dashboard-insight:", str(e))
        return jsonify({"error": str(e)}), 500
