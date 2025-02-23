
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

export const fetchPatternNoise = async (userId, judgmentId, theme, message, detectedBias, detectedNoise) => {
  const response = await fetch('http://127.0.0.1:5000/pattern_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      judgmentId: judgmentId,
      theme: theme,
      message: message,
      detectedBias: detectedBias,
      detectedNoise: detectedNoise,
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
        theme: judgmentData?.theme || "No Template",
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

export const fetchSource = async (messageContent, detectedBias, detectedNoise) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/source", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageContent, 
        detectedBias: detectedBias,
        detectedNoise: detectedNoise }),
    });

    const data = await response.json();

    return {
      biasSummary: data.bias_summary || "No bias source available.",
      noiseSummary: data.noise_summary || "No noise source available."
    };
  } catch (error) {
    return {
      biasSummary: "Error generating bias summary.",
      noiseSummary: "Error generating noise summary."
    };
  }
};

export const fetchAdvice = async (title, messageContent, detectedBias, detectedNoise) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/advice", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: title,
        messages: messageContent, 
        detectedBias: detectedBias,
        detectedNoise: detectedNoise }),
    });

    const data = await response.json();
    console.log("ADVICE:", data);
    return data;
  } catch (error) {
    return "Error generating advice.";
  }
};

export const fetchNewsAPI = async (messageContent) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/news_api", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: messageContent}),
    });

    const data = await response.json();
    console.log("NEWS API:", data);
    return data;
  } catch (error) {
    return "Error generating news articles.";
  }
};
