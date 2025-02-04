from src.Bias.train import train_model
from src.Bias.predict import predict_bias
import os
from src.Bias.load_model import load_bias_model

if __name__ == "__main__":
    
    if(os.path.exists('./models/sonus_model') and os.path.exists('./models/sonus_tokenizer')):
        print("Loading the model...")
        model, tokenizer, bias_labels = load_bias_model()
    else:
        print("Training the model...")
        model, tokenizer, bias_labels = load_bias_model() 

      
    
    print("Type a statement to identify the type of bias (or type 'exit' to quit):")
    while True:
        statement = input("Your statement: ")
        if statement.lower() == 'exit':
            break

        predicted_biases = predict_bias(model, tokenizer, statement, bias_labels)
        
        if predicted_biases:
            print(f"The predicted bias types are: {', '.join(predicted_biases)}")
        else:
            print("No biases detected.") 

