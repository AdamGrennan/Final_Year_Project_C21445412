from src.Onoise.train import train_model
from src.Onoise.predict import predict_noise
import os
from src.Onoise.load_model import load_noise_model

if __name__ == "__main__":
    
    if(os.path.exists('./models/saved_noise_model') and os.path.exists('./models/saved_noise_tokenizer')):
        print("Loading the model...")
        model, tokenizer, noise_labels = load_noise_model()
    else:
        print("Training the model...")
        model, tokenizer, noise_labels = train_model('./data/occasion_noise_set.csv')
    
    print("Type a statement to identify if occasion noise is present(or type 'exit' to quit):")
    while True:
        statement = input("Your statement: ")
        if statement.lower() == 'exit':
            break

        detected_noise = predict_noise(model, tokenizer, statement, noise_labels)
        
        if detected_noise:
            print(f"Detected: {', '.join(detected_noise)}")
        else:
            print("No occasion noise detected.") 

