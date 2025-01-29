export const fetchGPTResponse = async (input, messages, currentStage) => {
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

export const fetchBERTResponse = async (input) => {
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

export const fetchLevelNoise = async (input) => {
  const response = await fetch('http://127.0.0.1:5000/level_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: input.trim() }),
  });

  if (!response.ok) {
    throw new Error(`LevelNoise error: ${response.status}`);
  }

  const data = await response.json();
  console.log("Level Noise Response from Backend:", data);
  return data;
}

export const fetchOccasionNoise = async (input) => {
  const response = await fetch('http://127.0.0.1:5000/occasion_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: input.trim() }),
  });

  if (!response.ok) {
    throw new Error(`OccasionNoise error: ${response.status}`);
  }

  return response.json();
}

export const fetchPatternNoise = async (userId, judgmentId, title, description, theme, breakdown, detectedBias, detectedNoise) => {
  const response = await fetch('http://127.0.0.1:5000/pattern_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      judgmentId: judgmentId,
      title: title,
      description: description,
      theme: theme,
      breakdown: breakdown,
      detectedBias: detectedBias,
      detectedNoise: detectedNoise,
    }),
  });

  if (!response.ok) {
    throw new Error(`PatternNoise error: ${response.status}`);
  }

  return response.json();
}

export const openingMessage = async (judgmentData) => {
  
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
    }),
  });

  if (!response.ok) {
    console.error("Failed to send opening message:", response.status);
  }
  return response.json();
}