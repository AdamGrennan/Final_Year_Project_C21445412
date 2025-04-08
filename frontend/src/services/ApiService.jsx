
export const fetchGPTResponse = async (input, messages, setDisplayedText) => {

  const response = await fetch('http://127.0.0.1:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: input.trim(),
      context: messages.map((msg) => ({
        sender: msg.sender || "user",
        text: msg.text || "",
        detectedBias: msg.detectedBias || [],
        detectedNoise: msg.detectedNoise || [],
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`GPT error: ${response.status} - ${await response.text()}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let accumulatedText = ""; 
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    accumulatedText += chunk; 
    setDisplayedText(accumulatedText); 
  }
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
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: judgmentData?.title || "No Title Provided",
        name: name || "No Name Provided",
        details: {
          situation: judgmentData?.details?.situation || "",
          options: judgmentData?.details?.options || "",
          influences: judgmentData?.details?.influences || "",
          goal: judgmentData?.details?.goal || "",
        },
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

export const fetchChatSummary = async (title, messageContent, detectedBias, detectedNoise, biasSources, noiseSources) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/chat_summary", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: title,
        messages: messageContent, 
        detectedBias: detectedBias,
        detectedNoise: detectedNoise,
        biasSources: biasSources,
        noiseSources: noiseSources,}),
    });

    const data = await response.json();
    console.log("CHAT SUMMARY:", data);
    return data;
  } catch (error) {
    console.error("CHAT SUMMARY", error)
    return "Error generating chat summary.";
  }
}

export const fetchInsights = async ({ currentChatSummary, previousChatSummaries }) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentChatSummary,
         previousChatSummaries }),
    });

    const data = await response.json();
    console.log("SUMMARY RESPONSE:", data);

    return data;
  } catch (error) {
    console.log("ERROR in fetchInsights:", error);
    return { Strengths: [], "Areas to Improve": [] };
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


export const fetchDashboardInsights = async (decisions, trends) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/dashboard_insights", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decisions,
       }),
    });

    const data = await response.json();
    console.log("DASHBOARD INSIGHTS:", data);
    return data;
  } catch (error) {
    return "Error fetching dashboard insights.";
  }
};
