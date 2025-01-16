from flask import Flask
from flask_cors import CORS
from src.Bias.load_model import load_bias_model
from src.Onoise.load_model import load_noise_model
from src.api.bert import bert_endpoint
from src.api.occasion_noise import occasion_noise_endpoint
from src.api.gpt import gpt_endpoint
from src.api.breakdown import breakdown_endpoint
from src.api.sbert import sbert_endpoint
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

if not firebase_admin._apps:
    cred = credentials.Certificate('config/finalyearproject-35ec5-firebase-adminsdk-hxyoq-4258f91ae8.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)
CORS(app)

model, tokenizer, bias_labels = load_bias_model()

@app.route('/bert', methods=['POST'])
def bert():
    return bert_endpoint(model, tokenizer, bias_labels)

@app.route('/sbert', methods=['POST'])
def sbert():
    return sbert_endpoint(db)

@app.route('/occasion_noise', methods=['POST'])
def occasion_noise():
    return occasion_noise_endpoint(model, tokenizer, bias_labels)

@app.route('/gpt', methods=['POST'])
def gpt():
    return gpt_endpoint(model, tokenizer, bias_labels)

@app.route('/generate_breakdown', methods=['POST'])
def breakdown():
    return breakdown_endpoint(db)
    

if __name__ == '__main__':
    app.run(debug=True)
