"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { useDecision } from '@/context/DecisionContext';
import { fetchChats, saveChats } from "@/services/FirebaseService";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import { useJudgment } from "@/context/JudgementContext";
import { getFeedback } from "@/utils/decisionUtils/getFeedback";
import { openingMessage, fetchBERTResponse, fetchGPTResponse, fetchLevelNoise, fetchPatternNoise, fetchSource, fetchNewsAPI } from "@/services/ApiService";

const Chat = ({ judgementId, setFinishButtonDisable }) => {
  const [similiarDecisions, setSimilarDecisions] = useState([]);
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const { detectBias, detectNoise } = useDecision();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const hasInitialized = useRef(false);

  const createChat = async () => {
    if (messages.length > 0) return;

    if (user?.uid) {
      try {
        const openMessage = await openingMessage(
          {
            title: judgmentData?.title,
            theme: judgmentData?.theme,
            details: {
              situation: judgmentData?.details?.situation || "",
              options: judgmentData?.details?.options || "",
              influences: judgmentData?.details?.influences || "",
              goal: judgmentData?.details?.goal || "",
            },
          },
          user.name
        );
        

        if (openMessage.bias_feedback) {
          const openingMessage = {
            text: openMessage.bias_feedback,
            sender: "GPT",
          };

          setMessages([openingMessage]);
          saveChats(user, judgementId, [openingMessage], [], []);
        }
      } catch (error) {
        console.error("OPENING MESSAGE", error);
      }
    }
  };

  useEffect(() => {
    setFinishButtonDisable(buttonDisable);
  }, [buttonDisable, setFinishButtonDisable]);

  const onSend = async (option) => {
    setButtonDisable(true);
    const messageContent = option || input.trim();
    if (!messageContent) return;

    const newMessage = { text: messageContent, sender: "user", createdAt: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (!messages.some(msg => msg.sender === "user")) {
      setFinishButtonDisable(false);
  }
  
    try {
      let detectedBias = [];
      let detectedNoise = [];

      //await saveChats(user, judgementId, [newMessage], [], []);

      const bertData = await fetchBERTResponse(messageContent);
      if (bertData.predictions) {
        detectedBias = bertData.predictions.filter((bias) => bias !== "Neutral" && bias !== "OccasionNoise");
        console.log("Detected Bias", detectedBias)
      }

      const source = await fetchSource(messageContent, detectedBias, detectedNoise);
      if (source.biasSummary !== "No bias source available.") {
        detectedBias.forEach((bias) => detectBias(bias, source.biasSummary));
      }
      if (detectedNoise.length > 0 && source.noiseSummary !== "No noise source available.") {
        detectedNoise.forEach((noise) => detectNoise(noise, source.noiseSummary));
      }

      const patternNoiseData = await fetchPatternNoise(
        user.uid, 
        judgementId, 
        judgmentData.theme,
        messageContent,
        detectedBias,
        detectedNoise
      );

      if (patternNoiseData) {
        const { similarDecisions, patternNoiseSources } = patternNoiseData;
        if (similarDecisions && similarDecisions.length > 0) {
          console.log("Pattern Noise detected: Similar past decisions found.", similarDecisions);
          if (patternNoiseSources && patternNoiseSources.length > 0) {
            const patternNoiseSource = patternNoiseSources[0].source;
            detectNoise("Pattern Noise", patternNoiseSource);
            detectedNoise.push("Pattern Noise");
          }
          setSimilarDecisions(similarDecisions);
        } else {
          console.log("No Pattern Noise detected.");
          setSimilarDecisions([]);
        }
      }

      const levelNoiseData = await fetchLevelNoise(messageContent);
      if (levelNoiseData) {
        const { confidence_scores } = levelNoiseData;
      
        const harshScore = confidence_scores["harsh"] || 0;
        const lenientScore = confidence_scores["lenient"] || 0;
        const neutralScore = confidence_scores["neutral"] || 0;
      
        const threshold = 0.05; 
      
        let levelNoiseType = null;
      
        if (harshScore - neutralScore > threshold && harshScore > lenientScore) {
          levelNoiseType = "Harsh Level Noise";
        } else if (lenientScore - neutralScore > threshold && lenientScore > harshScore) {
          levelNoiseType = "Lenient Level Noise";
        }
      
        if (levelNoiseType) {
          detectedNoise.push(levelNoiseType); 
      
          const source = await fetchSource(messageContent, detectedBias, detectedNoise);
          const noiseSource =
            source.noiseSummary !== "No noise source available." ? source.noiseSummary : "No specific source";
      
          detectNoise(levelNoiseType, noiseSource); 
        }
      }
      const gptResponse = { text: "", sender: "GPT" };
      setMessages((prev) => [...prev, gptResponse]);

      await fetchGPTResponse(messageContent, messages, (newText) => {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.length - 1;
          if (lastMessageIndex >= 0) {
            updatedMessages[lastMessageIndex] = {
              ...updatedMessages[lastMessageIndex],
              text: newText, 
            };
          }
          return updatedMessages;
        });
      });
  
      await saveChats(user, judgementId, [gptResponse], detectedBias, detectedNoise);

      const newsAPI = await fetchNewsAPI(messageContent);

      if (newsAPI?.recency_bias_detected) {
        console.log("Possible Recency Bias detected:", newsAPI.most_similar_article.title);
      
        const recencySource = `It seems you may have read [${newsAPI.most_similar_article.title}], which could be affecting your judgment.`;
      
        detectBias("Recency Bias", recencySource);
        detectedBias.push("Recency Bias"); 
      } else {
        console.log("No Recency Bias detected");
      }
      
      await saveChats(user, judgementId, [{ ...newMessage }], detectedBias, detectedNoise);

    } catch (error) {
      console.error("ERROR, Can't connect to BERT OR GPT", error.message || error);
    }

    setButtonDisable(false);
    setFinishButtonDisable(false);
  };

  useEffect(() => {
    const fetchPreviousChats = async () => {
      if (!user?.uid) return;

      setMessages([]);

      const fetchedMessages = await fetchChats(user, judgementId);
      if (fetchedMessages.length > 0) {
        setMessages(fetchedMessages);
      } else if (!hasInitialized.current) {
        hasInitialized.current = true;
        await createChat();
      }
    };

    fetchPreviousChats();
  }, [judgementId]);

  return (
    <div className="h-[425px]">
      <MessageList messages={messages} />
      <MessageSender input={input} setInput={setInput} onSend={onSend} buttonDisable={buttonDisable} />
    </div>
  );
};

export default Chat;
