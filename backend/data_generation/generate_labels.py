from openai import OpenAI
import pandas as pd
import csv  # Import csv module for quoting
import time
import random
from difflib import SequenceMatcher

# Initialize OpenAI client with your API key
client = OpenAI(api_key="sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA")

# Define bias labels with multiple prompts to encourage variation
prompts = {
    "Overconfidence": [
        "Write a statement where someone is very confident in an uncertain outcome.",
        "Generate a sentence showing someone’s unshakeable belief in success despite challenges.",
        "Describe a situation where someone is overly sure of their abilities."
    ],
    "Confirmation": [
        "Create a statement showing someone’s decision based on previous success, despite limited information.",
        "Write a sentence where a person confirms their belief by only considering past positive results.",
    ],
    "Anchoring": [
        "Describe a judgment where someone heavily relies on first impressions.",
        "Generate a statement where a decision is based solely on initial information."
    ]
}

# Number of entries to generate per label in a single batch
batch_size = 50  # Smaller batch for testing
# Total entries we want for each label
target_count = 1000
# Number of batches to run for each label
num_batches = target_count // batch_size

def generate_text(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50,
            temperature=0.85
        )
        text = response.choices[0].message.content.strip()
        # Remove any extra internal quotation marks
        text = text.replace('"', '').replace("'", )
        return text
    except Exception as e:
        print(f"Error generating text: {e}")
        return None

# Function to remove near-duplicates
def is_similar(a, b, threshold=0.85):
    return SequenceMatcher(None, a, b).ratio() > threshold

def filter_duplicates(entries):
    unique_entries = []
    for entry in entries:
        if all(not is_similar(entry[0], existing[0]) for existing in unique_entries):
            unique_entries.append(entry)
    return unique_entries

def generate_batch(label, prompts_list):
    entries = []
    for _ in range(batch_size):
        prompt = random.choice(prompts_list)
        text = generate_text(prompt)
        if text:
            # Each entry is a tuple with text and its bias label
            entry = (text, f"{label} Bias")
            entries.append(entry)
        time.sleep(1)  # Add a slight delay to avoid hitting rate limits
    return entries

# Main loop to generate data for each bias type in batches
data = []
for label, prompts_list in prompts.items():
    for batch_num in range(num_batches):
        print(f"Generating batch {batch_num + 1} for label '{label}'")
        batch_data = generate_batch(label, prompts_list)
        filtered_batch = filter_duplicates(batch_data)  # Filter near-duplicates
        data.extend(filtered_batch)

        # Convert data to DataFrame with specific columns for cleaner format
        df = pd.DataFrame(data, columns=["text", "bias_label"])
        # Save with minimal quoting; quote only non-numeric fields to ensure format consistency
        df.to_csv("generated_single_label_dataset.csv", index=False, quoting=csv.QUOTE_MINIMAL)

        print(f"Batch {batch_num + 1} for '{label}' completed and saved.")

print("Dataset generation complete. Final data saved to 'generated_single_label_dataset.csv'")
