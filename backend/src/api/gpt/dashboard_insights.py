from flask import request, jsonify

def dashboard_insights_endpoint(client):
    try:
        data = request.json
        decisions = data.get("decisions", [])
        trends = data.get("trends", "")

        if not decisions:
            return jsonify({"error": "No decisions provided."}), 400

        prompt = (
            "You're SONUS, an intelligent assistant helping users reflect on judgment patterns.\n"
            "Below are 5 recent decisions the user made. Each decision includes a theme, context (situation, options, influences, goal), "
            "detected biases and noise, and a short system-generated insight.\n\n"
            "Your job is to analyze patterns and provide a reflection. Focus on recurring themes, decision tendencies, blind spots, and improvements.\n"
        )

        if trends:
            prompt += f"\nHere's a summary of recent trends across all decisions:\n{trends}\n\n"

        prompt += "Here are the 5 decisions:\n"

        for i, decision in enumerate(decisions, start=1):
            details = decision.get("details", {})
            biases = ', '.join(decision.get("detectedBias", [])) or 'None'
            noise = ', '.join(decision.get("detectedNoise", [])) or 'None'

            prompt += (
                f"\nDecision {i}:\n"
                f"Title: {decision.get('title', '—')}\n"
                f"Theme: {decision.get('theme', '—')}\n"
                f"Situation: {details.get('situation', '')}\n"
                f"Options: {details.get('options', '')}\n"
                f"Influences: {details.get('influences', '')}\n"
                f"Goal: {details.get('goal', '')}\n"
                f"Biases: {biases}\n"
                f"Noise: {noise}\n"
            )

        prompt += (
            "\nNow provide a short reflection (2–4 sentences) analyzing patterns in the user's decisions. "
            "Highlight recurring issues, positive changes, or areas to watch. Keep the tone constructive and helpful."
        )

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7,
        )

        summary = response.choices[0].message.content.strip()
        return jsonify({"summary": summary})

    except Exception as e:
        print("Error in dashboard-insight:", str(e))
        return jsonify({"error": str(e)}), 500
