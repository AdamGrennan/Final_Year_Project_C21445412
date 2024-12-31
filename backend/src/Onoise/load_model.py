from transformers import BertForSequenceClassification, BertTokenizer
from src.Onoise.data_load import load_data
import torch

#Thiss class loads my saved models
def load_noise_model():
    #Retreive saved model and tokenizer
    model = BertForSequenceClassification.from_pretrained("./models/saved_noise_model")
    tokenizer = BertTokenizer.from_pretrained("./models/saved_noise_tokenizer")
        
    #Load my dataset
    noise_labels = load_data('./data/occasion_noise_set.csv', return_labels_only=True)

    statement = "This is a test."
    #Prepare statement as a token for BERT to process
    inputs = tokenizer(statement, return_tensors='pt', padding=True, truncation=True, max_length=128)
    print(f"Inputs: {inputs}")

    #No grad saves memory running model in eval mode
    with torch.no_grad():
        #Inputs id is sentence in tokenized format
        #Attention mask tells model what tokens r real and what r padded
        outputs = model(input_ids=inputs['input_ids'], attention_mask=inputs['attention_mask'])

    #Raw scores for each bias and how it applies to statement
    print(f"Logits: {outputs.logits}")

    return model, tokenizer, noise_labels