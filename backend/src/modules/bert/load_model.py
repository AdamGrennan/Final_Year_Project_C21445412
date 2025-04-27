from transformers import BertForSequenceClassification, BertTokenizer
from src.modules.bert.data_load import load_data
import pandas as pd
import os

def load_bias_model():
    # Load model and tokenizer
    model = BertForSequenceClassification.from_pretrained("../models/sonus_v2_model")
    tokenizer = BertTokenizer.from_pretrained("../models/sonus_v2_tokenizer")


    # Load dataset to retrieve bias labels
    data = pd.read_csv("../data/sonus_dataset.csv", engine="python")  

    # Extract bias labels from columsn
    bias_labels = data.columns[1:].tolist()

    print(f"Bias Labels: {bias_labels}") 
    return model, tokenizer, bias_labels