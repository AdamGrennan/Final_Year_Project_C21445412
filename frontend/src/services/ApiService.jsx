
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

export const fetchPatternNoise = async (userId, judgmentId, title, description, theme, breakdown, detectedBias, detectedNoise) => {
  const response = await fetch('http://127.0.0.1:5000/pattern_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      judgmentId: judgmentId,
      theme: theme,
    }),
  });

  if (!response.ok) {
    throw new Error(`PatternNoise error: ${response.status}`);
  }

  return response.json();
}

export const openingMessage = async (judgmentData, name) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: judgmentData?.title || "No Title Provided",
        name: name || "No Name Provided",
        description: judgmentData?.description || "No Description Provided",
        template: judgmentData?.template || "No Template",
        input: "",
        context: [],
      }),
    });

    if (!response.ok) {
      console.error(`Failed to send opening message: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Server Response:", errorText);
      return { error: `Server responded with status ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    if (!data.bias_feedback) {
      console.warn("Warning: No 'bias_feedback' in response!", data);
    }

    return data;

  } catch (error) {
    console.error("Network error sending opening message:", error);
    return { error: "Network error: Failed to reach the server." };
  }
};

export const fetchSource = async (messageContent, detectedBias) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/source", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageContent, biases: detectedBias }),
    });

    const data = await response.json();
    console.log("SUMMARY:", data);
    return data.summary || "Unable to detect source.";
  } catch (error) {
    console.error("Error summarizing message:", error);
    return "Error generating summary.";
  }
};