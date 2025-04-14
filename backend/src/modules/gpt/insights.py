from flask import request, jsonify

def insight_endpoint(client):
    data = request.json

    current_chat_summary = data.get('currentChatSummary', "No summary available")
    previous_chat_summaries = data.get('previousChatSummaries', [])  

    def call_gpt(task_type):
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                {"role": "system", "content": f"You analyze decision-making behavior and return only {task_type} as bullet points. Do not include section headers or introductions. Use 'you' instead of 'the user', also include one related emoji at the end of each bullet point."},
                {"role": "user", "content": f"""
                You are analyzing a user’s decision-making patterns over time.
                Below is the most recent decision followed by the five most recent previous decisions. Each contains the title, theme, detected bias and noise, and a summary. Compare them and identify clear patterns.
                Be specific and avoid generic advice. You can refer to decision titles.
                Current Decision:
                {current_chat_summary}
                Past Decisions:
                {"\n\n".join(previous_chat_summaries)}"""}],
                max_tokens=150,  
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
