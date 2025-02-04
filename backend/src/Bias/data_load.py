import pandas as pd
import torch

# This class loads my dataset
def load_data(csv_file):
    data = pd.read_csv(csv_file, engine='python')
    print(f"Dataset loaded: {csv_file}")

    sentences = data.iloc[:, 0].tolist()  
    labels = data.iloc[:, 1:].values  

    #Extract Bias Labels
    bias_labels = data.columns[1:].tolist()
    print("Loaded Bias Labels:", bias_labels)

    return sentences, torch.tensor(labels, dtype=torch.float32), bias_labels 
