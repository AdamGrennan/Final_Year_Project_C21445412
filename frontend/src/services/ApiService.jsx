
export const fetchChatResponse = async (input,messages,setDisplayedText,
  patternContext,userId,judgementId,
  detectedBias,detectedNoise, recencyTitle) => {
  try{
  const response = await fetch('http://127.0.0.1:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: (input || "").trim(),
      userId: userId || "",              
      judgementId: judgementId || "",    
      patternContext,
      detectedBias,
      detectedNoise,
      recencyTitle,
      context: messages.map((msg) => ({
        sender: msg.sender || "user",
        text: msg.text || "",
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
  }
  setDisplayedText(accumulatedText); 

}catch (error) {
  console.error("Error fetching GPT response:", error);
  setDisplayedText("Error generating response.");
}
};

export const fetchBERTResponse = async (input) => {
  try{
  const response = await fetch('http://127.0.0.1:5000/bert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: input.trim() }),
  });

  if (!response.ok) {
    throw new Error(`BERT error: ${response.status}`);
  }

  return response.json();
}catch(error){
  console.error("Error fetching BERT response:", error);
  return { error: "Error fetching BERT response" };

}
};

export const fetchLevelNoise = async (input, userId, judgementId) => {
  try{
  const body = {
    input: input.trim(),
    user_id: userId,
    judgment_id: judgementId,
    save: false
  };

  const response = await fetch('http://127.0.0.1:5000/level_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`LevelNoise error: ${response.status}`);
  }

  return await response.json();
}catch(error){
  console.error("Error fetching Level Noise response:", error);
  return { error: "Error fetching Level Noise response" };
}
};

export const levelNoiseScores = async ({ action, userId, judgmentId, score}) => {
  try{
  const response = await fetch("http://127.0.0.1:5000/level_noise_scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      user_id: userId,
      judgment_id: judgmentId,
      score,
    }),
  });

  if (!response.ok) {
    throw new Error(`LevelNoise Score error: ${response.status}`);
  }

  const data = await response.json();
  if (action === "fetch") {
    return data.scores || [];
  }
  return data;
}catch(error){
  console.error("Error fetching Level Noise Scores response:", error);
  return { error: "Error fetching Level Noise Scores response" };
}
};

export const fetchPatternNoise = async (userId, judgmentId, theme, message, detectedBias, detectedNoise) => {
  try{
  const response = await fetch('http://127.0.0.1:5000/pattern_noise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      judgementId: judgmentId,
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
}catch(error){
  console.error("Error fetching Pattern Noise response:", error);
  return { error: "Error fetching Pattern Noise response:" };
}
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
        },
        theme: judgmentData?.theme || "No Template",
        input: "",
        context: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send opening message: ${response.status} ${response.statusText}`);
      console.error("Sonus Response:", errorText);  // 🛠 Log full backend error
      return { error: `Sonus responded with status ${response.status}: ${errorText}` };
    }
    

    const textData = await response.text(); 

    return { bias_feedback: textData };  

  } catch (error) {
    console.error("Error Opening Message.", error);
    return { error: "Error Opening Message." };
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
    return data;
  } catch (error) {
    console.error("Error generating advice.");
    return { error: "Error generating advice." };
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
    return data;
  } catch (error) {
    console.error("Error generating chat summary.");
    return { error: "Error generating chat summary." };
  }
}

export const fetchInsights = async ({ chatSummary }) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatSummary }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { suggestions: []};
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
    return data;
  } catch (error) {
    console.error("Error generating news articles.");
    return { error: "Error generating news articles." };
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
    return data;
  } catch (error) {
    console.error("Error fetching dashboard insights.");
    return { error: "Error fetching dashboard insights." };
  }
};

export const fetchSerp = async (query) => {
  try{
  const response = await fetch("http://127.0.0.1:5000/serp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.links || [];
 }catch (error) {
     console.error("Error fetching SERP.");
     return [];
  }
};

