import torch

def predict_bias(model, tokenizer, statement, bias_labels, threshold=0.65):
    
    inputs = tokenizer(statement, return_tensors='pt', padding=True, truncation=True, max_length=128)

    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']

    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)

    # Convert raw scores to probabilities
    sigmoid_scores = torch.sigmoid(outputs.logits).squeeze()

    # Apply threshold to get binary labels
    predicted_classes = (sigmoid_scores >= threshold).int().tolist()

    # Map i to bias labels
    predicted_biases = [bias_labels[i] for i in range(len(predicted_classes)) if predicted_classes[i] == 1]
    
    return predicted_biases
