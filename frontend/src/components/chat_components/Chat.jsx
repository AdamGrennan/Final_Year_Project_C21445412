"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { useDecision } from '@/context/DecisionContext';
import { fetchChats, saveChats } from "@/services/FirebaseService";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import { useJudgment } from "@/context/JudgementContext";
import { openingMessage, fetchBERTResponse, fetchGPTResponse, fetchLevelNoise, fetchOccasionNoise } from "@/services/ApiService";

const Chat = ({ judgementId }) => {
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const { detectBias, detectNoise } = useDecision();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const hasInitialized = useRef(false); 

useEffect(() => {
  console.log("Opening message triggered", judgementId);

  if (hasInitialized.current) {
    console.log("Already initialized, skipping...");
    return;
  }

  hasInitialized.current = true; 

  const createChat = async () => {
    if (messages.length > 0) return;

    if (user?.uid) {
      try {
        const openMessage = await openingMessage(judgmentData);
        console.log("✅ GPT Opening Message Received:", openMessage);

        if (openMessage.bias_feedback) {
          const openingMessage = {
            text: openMessage.bias_feedback,
            sender: "GPT",
          };

          setMessages([openingMessage]);
          saveChats(user, judgementId, [openingMessage], detectBias);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  createChat();
}, []);

  const onSend = async ( option ) => {
    setButtonDisable(true);
    const messageContent = option || input.trim();
    if (!messageContent) return;

    const newMessage = { text: messageContent, sender: user.name, createdAt: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const bertData = await fetchBERTResponse(messageContent);

      if (bertData.predictions) {
        bertData.predictions.forEach((bias) => {
          if (bias !== "Neutral") detectBias(bias);
        });

        const bertResponse = {
          text: `Detected Bias: ${bertData.predictions.join(", ")}`,
          sender: "BERT",
        };

        setMessages((prev) => [...prev, bertResponse]);
        saveChats(user, judgementId, [newMessage, bertResponse], detectBias);
      } else if (bertData.error) {
        console.error(bertData.error || "ERROR, No response from BERT")
      }

      const gptData = await fetchGPTResponse(messageContent, messages);
  
      if (gptData.bias_feedback) {
        const gptResponse = {
          text: gptData.bias_feedback,
          sender: "GPT",
        };

        setMessages((prev) => [...prev, gptResponse]);
        saveChats(user, judgementId, [newMessage, gptResponse], detectBias);
      }else if (gptData.error) {
        console.error(gptData.error || "ERROR, No response from GPT")
      }

      const levelNoiseData = await fetchLevelNoise(messageContent);

      if (levelNoiseData) {
        const { level_noise_percentage, confidence_scores } = levelNoiseData;     
        console.log("Level Noise Confidence Scores:", confidence_scores);
        console.log("Level Noise Percentage:", level_noise_percentage);
        detectNoise("Level Noise", level_noise_percentage);
      }
      
      const occasionNoiseData = await fetchOccasionNoise(messageContent);
      if (occasionNoiseData) {
        const { occasion_noise_percentages } = occasionNoiseData;
        console.log("Occasion Noise Score", occasion_noise_percentages);
        detectNoise("Occasion Noise", occasion_noise_percentages); 
    }

    } catch (error) {
      console.error("ERROR,Cant connect to BERT OR GPT", error.message || error)
    }
    setButtonDisable(false);
  };

  useEffect(() => {
    const fetchPreviousChats = async () => {
      if (!user?.uid || hasInitialized.current) return; 
  
      const fetchedMessages = await fetchChats(user, judgementId);
      if (fetchedMessages.length > 0) {
        setMessages((prev) => [...prev, ...fetchedMessages]);
      }
    };
  
    fetchPreviousChats();
  }, [judgementId]); 
  

  return (
    <div className="h-[425px]">
      <MessageList messages={messages} onSend={onSend}/>
      <MessageSender input={input} setInput={setInput} onSend={onSend} buttonDisable={buttonDisable}/>
    </div>

  );
};

export default Chat;
