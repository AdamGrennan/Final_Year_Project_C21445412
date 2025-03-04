import os
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from src.bert.load_model import load_bias_model
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv() 

def load_models():
    print("Loading models...")

    client = OpenAI(api_key="sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA")

    pipe = pipeline(model="facebook/bart-large-mnli")  
    sbert_model = SentenceTransformer("all-MiniLM-L6-v2") 
    model, tokenizer, bias_labels = load_bias_model()

    print("Models loaded successfully.")
    
    return {
        "gpt_client": client,
        "bert_model": model,
        "bert_tokenizer": tokenizer,
        "bert_labels": bias_labels,
        "sbert_model": sbert_model,
        "level_noise_pipe": pipe
    }
