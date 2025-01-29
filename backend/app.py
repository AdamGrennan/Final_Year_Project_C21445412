from flask import Flask
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from src.Bias.load_model import load_bias_model
from src.LevelNoise.level_noise import level_noise_endpoint
from src.api.bert import bert_endpoint
from src.OccasionNoise.occasion_noise import occasion_noise_endpoint
from src.api.gpt import gpt_endpoint
from src.api.breakdown import breakdown_endpoint
from src.PatternNoise.pattern_noise import pattern_noise_endpoint
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from transformers import pipeline

if not firebase_admin._apps:
    cred = credentials.Certificate('config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

#LevelNoise zero point model
pipe = pipeline(model="facebook/bart-large-mnli")

#SBERT model
#sbert_model = SentenceTransformer("occasion_noise_sbert")
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
#Flask session key
app.secret_key = 'NOISY_KEY'

model, tokenizer, bias_labels = load_bias_model()

@app.route('/bert', methods=['POST'])
def bert():
    return bert_endpoint(model, tokenizer, bias_labels)

@app.route('/pattern_noise', methods=['POST'])
def pattern_noise():
    return pattern_noise_endpoint(sbert_model, db)

@app.route('/occasion_noise', methods=['POST'])
def occasion_noise():
    return occasion_noise_endpoint(sbert_model)

@app.route('/level_noise', methods=['POST'])
def level_noise():
    return level_noise_endpoint(pipe)

@app.route('/gpt', methods=['POST'])
def gpt():
    return gpt_endpoint(model, tokenizer, bias_labels)

@app.route('/generate_breakdown', methods=['POST'])
def breakdown():
    return breakdown_endpoint(db)

if __name__ == '__main__':
    app.run(debug=True)
