from flask import Flask
from flask_cors import CORS
from src.Bias.load_model import load_bias_model
from src.Onoise.load_model import load_noise_model
from api.bert import bert_endpoint
from api.occasion_noise import occasion_noise_endpoint
from api.gpt import gpt_endpoint
from api.breakdown import breakdown_endpoint

app = Flask(__name__)
CORS(app)

model, tokenizer, bias_labels = load_bias_model()

@app.route('/bert', methods=['POST'])
def bert():
    return bert_endpoint(model, tokenizer, bias_labels)

@app.route('/occasion_noise', methods=['POST'])
def occasion_noise():
    return occasion_noise_endpoint(model, tokenizer, bias_labels)

@app.route('/gpt', methods=['POST'])
def gpt():
    return gpt_endpoint(model, tokenizer, bias_labels)

@app.route('/generate_breakdown', methods=['POST'])
def sbert():
    return breakdown_endpoint()
    

if __name__ == '__main__':
    app.run(debug=True)
