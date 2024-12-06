import torch

def predict_bias(model, tokenizer, statement, bias_labels, threshold=0.6):
    inputs = tokenizer(statement, return_tensors='pt', padding=True, truncation=True, max_length=128)

    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    
    #TO-DO check if I can remove this, Some models need but I might be okay 
    if 'token_type_ids' in inputs:
        token_type_ids = inputs['token_type_ids']
    else:
        token_type_ids = None
        print("No token_type_ids found.")
    
    with torch.no_grad():
        if token_type_ids is not None:
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)
        else:
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
    
    #Raw scores for my multi label bias detetcion
    sigmoid_score = torch.sigmoid(outputs.logits)
    
    #The threshold determines what bias is present, so if sigmoid score is greater than threshold etc
    predicted_classes = (sigmoid_score >= threshold).int().squeeze().tolist()

    #List of bias types detected
    bias_types = {i: label for i, label in enumerate(bias_labels)}
    
    predicted_biases = [bias_types[i] for i, pred in enumerate(predicted_classes) if pred == 1]
         
    return predicted_biases 
