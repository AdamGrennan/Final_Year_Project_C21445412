from flask import request, jsonify

def insight_endpoint(client):
    data = request.json
    current_chat_summary = data.get('chatSummary', "")

    try:
        system_prompt = (
            "You provide practical, thoughtful, and supportive suggestions to help a user improve their current decision-making process. "
            "Focus only on the current decision. Each suggestion should be 1–2 sentences max and framed as something they could try. "
            "Make it encouraging and helpful, not critical or overly formal."
        )
        user_content = f"""
        A user is making the following decision. It includes a description of decision, user expectations, and any detected biases or noise.
        Current Decision: {current_chat_summary}
        Please return 2–3 helpful 'Try this:' suggestions for improving this specific decision.
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            max_tokens=300,
            temperature=0.5
        )

        raw_output = response.choices[0].message.content.strip()
        suggestions = [line.strip().lstrip("-").strip() for line in raw_output.split("\n") if line.strip()]

    except Exception as e:
        print("GPT error:", e)
        suggestions = ["Unable to generate suggestions."]

    return jsonify({
        "suggestions": suggestions[:3] if len(suggestions) >= 3 else suggestions
    })
