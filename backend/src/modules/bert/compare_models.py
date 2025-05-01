import os
import torch
import numpy as np
from torch.utils.data import DataLoader
from transformers import BertForSequenceClassification, BertTokenizer
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from modules.bert.dataset import BiasDataset
from modules.bert.data_load import load_data

def evaluate(model, val_loader):
    model.eval()
    all_preds = []
    all_labels = []
    sigmoid = torch.nn.Sigmoid()

    with torch.no_grad():
        for batch in val_loader:
            input_ids = batch['input_ids']
            attention_mask = batch['attention_mask']
            labels = batch['labels']

            outputs = model(input_ids, attention_mask=attention_mask)
            probs = sigmoid(outputs.logits)
            preds = (probs >= 0.65).int().cpu().numpy()

            all_preds.append(preds)
            all_labels.append(labels.cpu().numpy())

    all_preds = np.concatenate(all_preds, axis=0)
    all_labels = np.concatenate(all_labels, axis=0)

    f1 = f1_score(all_labels, all_preds, average='macro')
    precision = precision_score(all_labels, all_preds, average='macro')
    recall = recall_score(all_labels, all_preds, average='macro')

    return f1, precision, recall

def compare_models():
    # Absolute path to the /models folder
    BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../models"))

    model_paths = {
        "sonus_v3_model": {
            "model": os.path.join(BASE_PATH, "sonus_v3_model"),
            "tokenizer": os.path.join(BASE_PATH, "sonus_v3_tokenizer")
        },
        "sonus_v2_model": {
            "model": os.path.join(BASE_PATH, "sonus_v2_model"),
            "tokenizer": os.path.join(BASE_PATH, "sonus_v2_tokenizer")
        }
    }

    # Load dataset and validation split
    sentences, labels, bias_labels = load_data("../data/sonus_dataset.csv")
    _, sentence_val, _, label_val = train_test_split(sentences, labels, test_size=0.15, random_state=42)

    # Evaluate each model
    for name, paths in model_paths.items():
        print(f"\nEvaluating: {name}")
        tokenizer = BertTokenizer.from_pretrained(paths["tokenizer"], local_files_only=True)
        model = BertForSequenceClassification.from_pretrained(paths["model"], local_files_only=True)

        val_dataset = BiasDataset(sentence_val, label_val, tokenizer)
        val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

        f1, precision, recall = evaluate(model, val_loader)

        print(f"F1 Score: {f1:.4f}, Precision: {precision:.4f}, Recall: {recall:.4f}")

if __name__ == "__main__":
    compare_models()
