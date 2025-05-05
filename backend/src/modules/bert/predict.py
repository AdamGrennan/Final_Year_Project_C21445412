import torch

def predict_bias(model, tokenizer, statement, bias_labels):
    bias_thresholds = {
        "OverconfidenceBias": 0.9,
        "ConfirmationBias": 0.65,
        "AnchoringBias": 0.65,
        "Neutral": 0.65,
        "OccasionNoise": 0.65
    }
    
    inputs = tokenizer(statement, return_tensors='pt', padding=True, truncation=True, max_length=128)

    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']

    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)

    # Convert raw scores to probabilities
    sigmoid_scores = torch.sigmoid(outputs.logits).squeeze()

    # Apply threshold to get binary labels
    predicted_biases = [
        bias_labels[i]
        for i in range(len(sigmoid_scores))
        if sigmoid_scores[i] >= bias_thresholds.get(bias_labels[i], 0.65)
    ]
    
    return predicted_biases
