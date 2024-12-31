import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

#This class loads my dataset
def load_data(csv_file, return_labels_only=False):
    data = pd.read_csv(csv_file, engine='python')
    print(f"Dataset loaded: {csv_file}")
    sentences = data['sentences'].tolist()
    
    #Split the labels 
    labels = [label_str.split(', ') for label_str in data['labels'].tolist()]
    
    #The mlb converts a multi bias label into binary for BERT to process
    mlb = MultiLabelBinarizer()
    #Convert labels to binary
    labels = mlb.fit_transform(labels)
    
    #Return any unique bias labels
    noise_labels = mlb.classes_.tolist()
    
    if return_labels_only:
        return noise_labels 
    
    return sentences, labels, noise_labels