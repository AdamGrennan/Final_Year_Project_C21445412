from flask import request, jsonify

def insight_endpoint(client):
    data = request.json

    current_chat_summary = data.get('currentChatSummary', "No summary available")
    previous_chat_summaries = data.get('previousChatSummaries', [])  
    trends = data.get('trends', [])

    trend_summary = "\n".join([t.get("message", "") for t in trends]) if trends else "No trends detected."

    def call_gpt(task_type):
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                {"role": "system", "content": f"You analyze decision-making behavior and return each {task_type} as a short, personalized paragraph. Avoid using bullet points or markdown. Use second-person voice and write it as if you're reflecting with the user."},
                {"role": "user", "content": f"""
                You are analyzing a user’s decision-making patterns over time.
                Below is the most recent decision followed by the five most recent previous decisions. Each contains the title, theme, detected bias and noise, and a summary. Compare them and identify clear patterns.
                Additionally, here are some trends detected across their decisions:{trend_summary}
                Be specific, reflective, and mention if patterns have been repeated across multiple decisions. Do not just give tips—explain how the user tends to think and how that affects decisions.
                Current Decision:
                {current_chat_summary}
                Past Decisions:
                {"\n\n".join(previous_chat_summaries)}"""}],
                max_tokens=300,  
                temperature=0.5  
            )

            raw_output = response.choices[0].message.content.strip()
            feedback_lines = [line.strip().lstrip("-").strip() for line in raw_output.split("\n") if line.strip()] 

            return feedback_lines[:3] if len(feedback_lines) >= 3 else feedback_lines 

        except Exception as e:
            return ["Unable to generate summary due to an error."]

    return jsonify({
        "Strengths": call_gpt("strengths in decision-making"),
        "Improvements": call_gpt("areas for improvement")
    })
