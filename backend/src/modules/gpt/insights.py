
from flask import request, jsonify
import re

def insight_endpoint(client):
    data = request.json
    current_chat_summary = data.get('chatSummary', "")

    try:
        system_prompt = (
            "You provide practical, supportive suggestions to help a user improve their current decision-making. "
            "Focus only on the current decision. Each suggestion should be 1–2 sentences max. "
            "Present them as a short, clearly separated list (not in a single paragraph)."
        )

        user_content = f"""
        A user is making the following decision. It includes a description of the decision, user expectations, and any detected biases or noise.
        Current Decision: {current_chat_summary}
        Please return 2–3 helpful suggestions for improving this specific decision.
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

        output = response.choices[0].message.content.strip()
        strip_output = output.splitlines()

        suggestions = []
        for i in strip_output:
            clean_line = re.sub(r"^\s*(?:-|\d+\.)\s*", "", i)
            if len(clean_line.strip()) > 10:
                suggestions.append(clean_line.strip())
        suggestions = suggestions[:3]

    except Exception as e:
        print("GPT error:", e)
        suggestions = ["Unable to generate suggestions due to an error."]

    return jsonify({
        "suggestions": suggestions
    })
