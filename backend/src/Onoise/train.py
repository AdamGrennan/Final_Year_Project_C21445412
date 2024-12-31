from transformers import BertTokenizer, BertForSequenceClassification
from torch.optim import AdamW
import torch.nn as nn
from torch.utils.data import DataLoader
import torch
import numpy as np
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split 
from src.Onoise.dataset import NoiseDataset
from src.Onoise.data_load import load_data

#TO-Do up the btach size for tests
def train_model(csv_file, model_name='bert-base-uncased', batch_size=16, epochs=5):
    #Load tokenizer
    tokenizer = BertTokenizer.from_pretrained(model_name)

    #load data
    sentences, labels, noise_labels = load_data(csv_file)
    
    #Split my data into training and validation set
    sentence_train, sentence_val, label_train, label_val = train_test_split(sentences, labels, test_size=0.15, random_state=42)

    train_dataset = NoiseDataset(sentence_train, label_train, tokenizer)
    val_dataset = NoiseDataset(sentence_val, label_val, tokenizer)

    #Shuffle just randomises my order of labels in tarining set
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    #Intialize the model
    model = BertForSequenceClassification.from_pretrained(
        model_name, 
        num_labels=len(noise_labels),
        attention_probs_dropout_prob=0.3, 
        hidden_dropout_prob=0.3 
    )
    #This adjust the rate in which my model learns at
    optimizer = AdamW(model.parameters(), lr=5e-5, weight_decay=0.01)
    
    #class_weights = torch.tensor([1.0, 1.0, 1.0, 1.0]) 
    criterion = nn.BCEWithLogitsLoss() 
    
    best_val_loss = float('inf')

#Training my actual set
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
        
        print(f'Epoch {epoch + 1}/{epochs}, Loss: {total_loss/len(train_loader)}')
        
#Evaluating training date
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
                predicted_classes = (sigmoid_score >= 0.6).int().cpu().numpy()  
                all_predictions.append(predicted_classes)
                all_labels.append(labels.cpu().numpy())

        avg_val_loss = val_loss / len(val_loader)
        print(f'Validation Loss: {avg_val_loss}')
        
        all_predictions = np.concatenate(all_predictions, axis=0)
        all_labels = np.concatenate(all_labels, axis=0)

        f1 = f1_score(all_labels, all_predictions, average='macro')
        precision = precision_score(all_labels, all_predictions, average='macro')
        recall = recall_score(all_labels, all_predictions, average='macro')

        print(f'F1 Score: {f1:.4f}, Precision: {precision:.4f}, Recall: {recall:.4f}')
        
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            patience_counter = 0  
        else:
            patience_counter += 1
    
    #Save model and tokenizer
    model.save_pretrained('./models/saved_noise_model')
    tokenizer.save_pretrained('./models/saved_noise_tokenizer')
    
    return model, tokenizer, noise_labels
