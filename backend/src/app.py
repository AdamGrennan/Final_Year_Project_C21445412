import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from flask import Flask
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from modules.bert.load_model import load_bias_model
from noise.level_noise import level_noise_endpoint
from api.bert import bert_endpoint
from modules.gpt.chat import chat_endpoint
from modules.gpt.source import source_endpoint
from modules.gpt.advice import advice_endpoint
from modules.gpt.chat_summary import chat_summary_endpoint
from modules.gpt.insights import insight_endpoint
from noise.pattern_noise import pattern_noise_endpoint
from news.news_api import news_api_endpoint
from modules.gpt.dashboard_insights import dashboard_insights_endpoint
from config.firebase_config import initialize_firebase
from transformers import pipeline
from openai import OpenAI

db = initialize_firebase()

#GPT API key
client = OpenAI(api_key="sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA")

#LevelNoise zero point model
pipe = pipeline(model="facebook/bart-large-mnli")

#SBERT model
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

model, tokenizer, bias_labels = load_bias_model()

@app.route('/bert', methods=['POST'])
def bert():
    return bert_endpoint(model, tokenizer, bias_labels)

@app.route('/pattern_noise', methods=['POST'])
def pattern_noise():
    return pattern_noise_endpoint(sbert_model, db)

@app.route('/level_noise', methods=['POST'])
def level_noise():
    return level_noise_endpoint(pipe)

@app.route('/news_api', methods=['POST'])
def news_api():
    return news_api_endpoint(sbert_model)

@app.route('/chat', methods=['POST'])
def chat():
    return chat_endpoint(model, tokenizer, bias_labels, client)

@app.route('/source', methods=['POST'])
def source():
    return source_endpoint(client)

@app.route('/advice', methods=['POST'])
def advice():
    return advice_endpoint(client)

@app.route('/chat_summary', methods=['POST'])
def chat_summary():
    return chat_summary_endpoint(client)

@app.route('/insights', methods=['POST'])
def insights():
    return insight_endpoint(client)#

@app.route('/dashboard_insights', methods=['POST'])
def dashboard_insights():
    return dashboard_insights_endpoint(client)
