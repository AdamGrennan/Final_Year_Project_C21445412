from flask import request, jsonify
from src.Bias.predict import predict_bias
import openai

openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

BIAS_TYPES = ["OverconfidenceBias", "ConfirmationBias", "AnchoringBias", "Neutral"]

def gpt_endpoint(model, tokenizer, bias_labels):
    data = request.json
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    template = data.get("template", "").strip()
    deadline = data.get("deadline", "").strip()
    statement = data.get("input", "").strip()
    context = data.get("context", [])
    current_stage = data.get("currentStage", 1)

    try:
        detected_biases = predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6)
        detected_biases = [bias for bias in detected_biases if bias in BIAS_TYPES]

        bias_hints = {
            "OverconfidenceBias": "Consider exploring alternative perspectives or risks.",
            "ConfirmationBias": "You might want to evaluate information that challenges your assumptions.",
            "AnchoringBias": "Think about how initial impressions may have influenced your decision.",
            "Neutral": ""
        }
        hints = " ".join(bias_hints.get(bias, "") for bias in detected_biases)

        stage_prompts = {
            1: f"Hi! I’m SONUS, your decision-support assistant. How can I assist you with your decision today?",
            2: f"User has shared their decision: {statement}. {hints} Could you explain the reasoning behind this?",
            3: f"You mentioned: {statement}. {hints} What other factors or considerations are influencing your thoughts?",
            4: f"You're nearing the end of your analysis. {hints} Is there anything else you'd like to add?",
            5: "Thank you for sharing. Let's summarize your decision and prepare the final report."
        }
        
        if current_stage == 1 and not context and not statement:
            return jsonify({"bias_feedback": stage_prompts[1]})

        messages = [
            {"role": "system",
             "content": 
                "You are SONUS, a decision-support assistant that helps users reflect and identify biases."
                 "Your job is to guide users through reflecting on decisions, asking meaningful questions, "
                 "and offering thoughtful insights. You are professional, empathetic, and concise in your responses."}
        ]   
        messages.extend(
            {"role": "assistant" if chat["sender"] == "GPT" else "user", "content": chat["content"]}
            for chat in context
        )
        if statement:
            messages.append({"role": "user", "content": statement})
        messages.append({"role": "user", "content": stage_prompts.get(current_stage, "Provide a stage-specific response.")})

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=200,
            temperature=0.7, 
        )

        feedback = response.choices[0].message['content'].strip() if response.choices else "I'm sorry, I couldn't generate a response. Please try again."
        return jsonify({"bias_feedback": feedback})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
