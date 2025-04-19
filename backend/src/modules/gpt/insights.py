from flask import request, jsonify

def insight_endpoint(client):
    data = request.json

    current_chat_summary = data.get('currentChatSummary', "No summary available")
    previous_chat_summaries = data.get('previousChatSummaries', [])  
    trends = data.get('trends', [])

    trend_summary = "\n".join([t.get("message", "") for t in trends]) if trends else "No trends detected."

    def call_gpt(task_type):
        try:
            if task_type == "strengths in decision-making":
                system_prompt = (
                    "You analyze decision-making behavior and return each strength as a short, positive, and personalized paragraph. "
                    "Highlight habits, thought patterns, or decision styles that helped the user make thoughtful, reflective, or consistent decisions. "
                    "Focus only on what the user is doing well — this should feel encouraging and affirming."
                )
            else: 
                system_prompt = (
                    "You analyze decision-making behavior and return each area for improvement as a short, constructive paragraph. "
                    "Point out specific thinking patterns that may be limiting or flawed, and suggest how the user could improve or rethink their approach."
                )

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"""
                    You are analyzing a user’s decision-making patterns over time.
                    Below is the most recent decision followed by the five most recent previous decisions. Each contains the title, theme, detected bias and noise, and a summary.
                    Additionally, here are some trends detected across their decisions:{trend_summary}
                    Current Decision:{current_chat_summary}
                    Past Decisions:{"\n\n".join(previous_chat_summaries)}
                    Please return 2–3 personalized {task_type}."""}
                ],
                max_tokens=300,
                temperature=0.5
            )

            raw_output = response.choices[0].message.content.strip()
            feedback_lines = [line.strip().lstrip("-").strip() for line in raw_output.split("\n") if line.strip()]

            return feedback_lines[:3] if len(feedback_lines) >= 3 else feedback_lines

        except Exception as e:
            print("GPT error:", e)
            return ["Unable to generate summary due to an error."]

    return jsonify({
        "Strengths": call_gpt("strengths in decision-making"),
        "Improvements": call_gpt("areas for improvement")
    })
