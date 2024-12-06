import openai
import pandas as pd
import csv

# Replace with your OpenAI API key
openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

def generate_diverse_samples(label, num_samples=50):
    "Generate specified number of diverse samples for a given label."
    generated_samples = []
    for _ in range(num_samples):
        try:
            # Generate the sentence
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that generates diverse and concise examples for bias detection."},
                    {
                        "role": "user",
                        "content": (
                            f"Generate a single diverse sentence that demonstrates the following bias(es): {label}. "
                            "Make it unique, creative, and realistic. Only output the sentence, no explanations."
                        )
                    }
                ],
                max_tokens=80,
                temperature=0.9  # Higher temperature for diversity
            )
            generated_text = response['choices'][0]['message']['content'].strip()
            # Append the cleaned result
            generated_samples.append({"sentences": f'"{generated_text}"', "labels": f'"{label}"'})
        except Exception as e:
            print(f"Error generating for {label}: {e}")
    return generated_samples

# Specify the label type
label_to_generate = "AnchoringBias, ConfirmationBias"  # Change this to your desired label type
num_samples = 80  # Number of sentences to generate

# Generate the samples
generated_samples = generate_diverse_samples(label_to_generate, num_samples)

# Save to a CSV file
df = pd.DataFrame(generated_samples)
output_file_path = f"generated_{label_to_generate.replace(', ', '_')}_bias_set.csv".replace(" ", "_")
df.to_csv(output_file_path, index=False, header=False, quoting=csv.QUOTE_MINIMAL)

print(f"Generated dataset for {label_to_generate} saved to {output_file_path}")
