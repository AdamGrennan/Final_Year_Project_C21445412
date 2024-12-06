from torch.utils.data import Dataset
import torch

#This class prepares my dataset in a format that BERT can understand
class BiasDataset(Dataset):
    #Initliaze dataset
    def __init__(self, sentences, labels, tokenizer, max_length=128):
        self.sentences = sentences
        self.labels = labels # Biases
        self.tokenizer = tokenizer
        self.max_length = max_length

    #Size of dataset
    def __len__(self):
        return len(self.sentences)

#Processes sentences in a format for BERT to understand
    def __getitem__(self, index):
        sentence = self.sentences[index]
        labels = self.labels[index]
        encoding = self.tokenizer.encode_plus(
            sentence,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(labels, dtype=torch.float)
        }