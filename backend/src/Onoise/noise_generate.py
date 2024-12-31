import openai
import pandas as pd
import csv

# Replace with your OpenAI API key
openai.api_key = "sk--6J0lHtxcBaT3MAGsCdv45c8e-ApLvzWOsQGbSFMU0T3BlbkFJU_iEG2lxrrnZJOdpd3OahPhtj5ecFBavR_DH-kBVMA"

def generate_occ_noise_samples(label, num_samples=10):
    """
    Generate specified number of diverse samples for a given Occasion Noise label.
    """
    generated_samples = []
    for _ in range(num_samples):
        try:
            # Customize the prompt based on the label
            prompt = (
                "Generate a single, realistic, first-person sentence from a user "
                "demonstrating the following label: "
            )
            if label == "OccasionNoise":
                prompt += (
                    "Occasion Noise seemingly irrelevant factors like time of day, their mood, the weather affecting people decision making."
                    "Provide examples from different aspects of life, work and broad range of examples"
                    "Make the sentence realistic, and concise with strong variety. Only output the sentence."
                )
            elif label == "No Noise":
                prompt += (
                    "No Noise. The user is calm, focused, and ready to make a decision. "
                    "Make the sentence creative, realistic, and concise. Only output the sentence."
                )

            # Use OpenAI API to generate a statement
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant generating diverse Occasion Noise dataset."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=80,
                temperature=0.9,  # High temperature for diversity
            )

            # Extract and clean the generated text
            generated_text = response['choices'][0]['message']['content'].strip()
            generated_samples.append({"sentence": generated_text, "label": label})

        except Exception as e:
            print(f"Error generating for {label}: {e}")

    return generated_samples

# Generate samples for both Noise and No Noise labels
num_samples_per_label = 10
noise_samples = generate_occ_noise_samples("OccasionNoise", num_samples_per_label)
no_noise_samples = generate_occ_noise_samples("No Noise", num_samples_per_label)

# Combine the datasets
combined_samples = noise_samples + no_noise_samples

# Save to a CSV file
df = pd.DataFrame(combined_samples)
output_file_path = "occasion_noise_set.csv"
df.to_csv(output_file_path, index=False, quoting=csv.QUOTE_MINIMAL)

print(f"Generated Occasion Noise dataset saved to {output_file_path}")
