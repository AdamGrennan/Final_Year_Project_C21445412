export const fetchGPTResponse = async(input, messages, currentStage) => {
    const response = await fetch('http://127.0.0.1:5000/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          context: messages.map((msg) => ({
            sender: msg.sender || "user",
            content: msg.text || "",
          })),
          currentStage,
        }),
      });
      if (!response.ok) {
        throw new Error(`GPT error: ${response.status} - ${await response.text()}`);
      }
      return response.json();
};

export const fetchBERTResponse = async(input) => {
    const response = await fetch('http://127.0.0.1:5000/bert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        throw new Error(`BERT error: ${response.status}`);
      }

      return response.json();
};

export const fetchLevelNoise = async(input) => {
    const response = await fetch('http://127.0.0.1:5000/level_noise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      });

      if(!response.ok){
        throw new Error(`LevelNoise error: ${response.status}`);
      }

      return response.json();
}

export const openingMessage = async(judgmentData) => {
  const context = [];

    const response = await fetch('http://127.0.0.1:5000/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: judgmentData.title,
          description: judgmentData.description,
          template: judgmentData.template,
          deadline: judgmentData.deadline,
          input: "",
          context: [],
          currentStage: 1
        }),
      });

      if (!response.ok) {
        console.error("Failed to send opening message:", response.status);
      }
      return response.json();
}