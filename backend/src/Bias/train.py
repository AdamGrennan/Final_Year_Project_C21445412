from transformers import BertTokenizer, BertForSequenceClassification
from torch.optim import AdamW
import torch.nn as nn
from torch.utils.data import DataLoader
import torch
import numpy as np
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from src.Bias.dataset import BiasDataset
from src.Bias.data_load import load_data

# Train Model
def train_model(csv_file, model_name='bert-base-uncased', batch_size=32, epochs=4, early_stop_patience=2):
    # Load tokenizer
    tokenizer = BertTokenizer.from_pretrained(model_name)

    # Load data
    sentences, labels = load_data(csv_file)

    # Split data into training and validation set
    sentence_train, sentence_val, label_train, label_val = train_test_split(
        sentences, labels, test_size=0.15, random_state=42
    )

    train_dataset = BiasDataset(sentence_train, label_train, tokenizer)
    val_dataset = BiasDataset(sentence_val, label_val, tokenizer)

    #Shuffle training data for randomness
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    # Initialize the BERT model for mlb
    model = BertForSequenceClassification.from_pretrained(
        model_name,
        num_labels=6,
        attention_probs_dropout_prob=0.2, 
        hidden_dropout_prob=0.2
    )

    # Optimizer & Loss Function
    optimizer = AdamW(model.parameters(), lr=1e-5, weight_decay=0.01) 
    criterion = nn.BCEWithLogitsLoss()

    # Early stopping setup
    best_val_loss = float('inf')
    patience_counter = 0

    # Training loop
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for batch in train_loader:
            optimizer.zero_grad()
            input_ids = batch['input_ids']
            attention_mask = batch['attention_mask']
            labels = batch['labels']
            
            outputs = model(input_ids, attention_mask=attention_mask)
            loss = criterion(outputs.logits, labels)
            total_loss += loss.item()

            loss.backward()
            optimizer.step()

        avg_train_loss = total_loss / len(train_loader)
        print(f'Epoch {epoch + 1}/{epochs}, Train Loss: {avg_train_loss:.4f}')

        # Validation
        model.eval()
        val_loss = 0
        all_predictions = []
        all_labels = []

        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids']
                attention_mask = batch['attention_mask']
                labels = batch['labels']

                outputs = model(input_ids, attention_mask=attention_mask)
                val_loss += criterion(outputs.logits, labels).item()

                sigmoid_score = torch.sigmoid(outputs.logits)
                predicted_classes = (sigmoid_score >= 0.7).int().cpu().numpy()

                all_predictions.append(predicted_classes)
                all_labels.append(labels.cpu().numpy())

        avg_val_loss = val_loss / len(val_loader)
        print(f'Validation Loss: {avg_val_loss:.4f}')

        # Calculate F1, Precision, Recall
        all_predictions = np.concatenate(all_predictions, axis=0)
        all_labels = np.concatenate(all_labels, axis=0)

        f1 = f1_score(all_labels, all_predictions, average='macro')
        precision = precision_score(all_labels, all_predictions, average='macro')
        recall = recall_score(all_labels, all_predictions, average='macro')

        print(f'F1 Score: {f1:.4f}, Precision: {precision:.4f}, Recall: {recall:.4f}')

        # Save only the best model after each epoch
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            patience_counter = 0  
            print("Saving best model...")
            model.save_pretrained('./models/sonus_model')
            tokenizer.save_pretrained('./models/sonus_tokenizer')
        else:
            patience_counter += 1
            print(f"No improvement. Patience: {patience_counter}/{early_stop_patience}")

            if patience_counter >= early_stop_patience:
                print(f"Early stopping at epoch {epoch + 1}")
                break 

    return model, tokenizer
