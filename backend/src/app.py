from flask import Flask
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from bert.load_model import load_bias_model
from api.level_noise.level_noise import level_noise_endpoint
from api.bert_endpoint import bert_endpoint
from api.gpt.gpt import gpt_endpoint
from api.gpt.source import source_endpoint
from api.gpt.advice import advice_endpoint
from api.pattern_noise.pattern_noise import pattern_noise_endpoint
from api.news_api.news_api import news_api_endpoint
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from transformers import pipeline
from openai import OpenAI

if not firebase_admin._apps:
    cred = credentials.Certificate('../config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

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

@app.route('/gpt', methods=['POST'])
def gpt():
    return gpt_endpoint(model, tokenizer, bias_labels, client)

@app.route('/source', methods=['POST'])
def source():
    return source_endpoint(client)

@app.route('/advice', methods=['POST'])
def advice():
    return advice_endpoint(client)

if __name__ == '__main__':
    app.run(debug=True)
