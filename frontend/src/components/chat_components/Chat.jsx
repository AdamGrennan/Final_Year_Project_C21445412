"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useDecision } from '@/context/DecisionContext';
import { fetchChats, saveChats } from "@/services/FirebaseService";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import PromptManager from "../../services/PromptService";
import { useJudgment } from "@/context/JudgementContext";
import { openingMessage, fetchBERTResponse, fetchGPTResponse, fetchLevelNoise } from "@/services/ApiService";

const Chat = ({ judgementId, stage }) => {
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const { detectBias, detectNoise } = useDecision();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentStage, setCurrentStage] = useState(1);
  const [buttonDisable, setButtonDisable] = useState(false);
  const promptManager = new PromptManager();

  const isLastStage = currentStage >= 5;

  useEffect(() => {
    let hasInitialized = false;
    const createChat = async () => {
      if (hasInitialized || messages.length > 0) {
        return;
      }

      hasInitialized = true;

      if (user && user.uid) {
        try {
          const openMessage = await openingMessage(judgmentData);

          if (openMessage.bias_feedback) {
            const openingMessage = {
              text: openMessage.bias_feedback,
              sender: "GPT",
            };

            stage(1);
            setMessages([openingMessage]);
            saveChats(user, judgementId, [openingMessage], detectBias);
          }
          const now = new Date();
          const prompt = promptManager.checkIfTired(now);

          if (prompt) {
            const promptMessage = {
              ...prompt,
              sender: "System",
              createdAt: now.toISOString(),
              type: "prompt"
            };

            setButtonDisable(true);
            setMessages((prev) => [...prev, promptMessage]);
            saveChats(user, judgementId, [promptMessage], detectBias);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    if (!hasInitialized) {
      createChat();
    }
  }, [user, judgementId]);

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

      const gptData = await fetchGPTResponse(messageContent, messages, currentStage);
  
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
      const { labels, scores } = levelNoiseData;
      const maxScoreIndex = scores.indexOf(Math.max(...scores));
      const detectedLevelNoise = labels[maxScoreIndex];
      if (detectedLevelNoise === "harsh") {
        detectNoise("Level Noise");
      }
  
      if (currentStage < 5) {
        const newStage = currentStage + 1;
        setCurrentStage(newStage);
        stage(newStage);
      } else {
        alert("Invalid input detected; not advancing stage.");
      }

    } catch (error) {
      console.error("ERROR,Cant connect to BERT OR GPT", error.message || error)
    }
    setButtonDisable(false);
  };

  useEffect(() => {
    const fetchPreviousChats = async () => {
      const fetchedMessages = await fetchChats(user, judgementId);
      setMessages((prev) => [...prev, ...fetchedMessages]);
    };
    fetchPreviousChats();
  }, [judgementId]);

  return (
    <div className="h-[425px]">
      <MessageList messages={messages} onSend={onSend}/>
      <MessageSender input={input} setInput={setInput} isLastStage={isLastStage} onSend={onSend} buttonDisable={buttonDisable}/>
    </div>

  );
};

export default Chat;
