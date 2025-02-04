"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { useDecision } from '@/context/DecisionContext';
import { fetchChats, saveChats } from "@/services/FirebaseService";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import { useJudgment } from "@/context/JudgementContext";
import { openingMessage, fetchBERTResponse, fetchGPTResponse, fetchLevelNoise, fetchPatternNoise, fetchSource } from "@/services/ApiService";

const Chat = ({ judgementId }) => {
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
        const openMessage = await openingMessage(judgmentData, user.name);
        console.log("GPT Opening Message Received:", openMessage);

        if (openMessage.bias_feedback) {
          const openingMessage = {
            text: openMessage.bias_feedback,
            sender: "GPT",
          };

          setMessages([openingMessage]);
          saveChats(user, judgementId, [openingMessage]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSend = async (option) => {
    setButtonDisable(true);
    const messageContent = option || input.trim();
    if (!messageContent) return;

    const newMessage = { text: messageContent, sender: user.name, createdAt: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      let detectedBias = [];
      let detectedNoise = [];

      await saveChats(user, judgementId, [newMessage]);
      const bertData = await fetchBERTResponse(messageContent);

      const summary = await fetchSource(messageContent, bertData.predictions);

      if (bertData.predictions) {
        bertData.predictions.forEach((bias) => {

          if (bias !== "Neutral" && bias !== "OccasionNoise") {
            detectBias(bias, summary);
            detectedBias.push(bias);
          }
          if (bias === "OccasionNoise") {
            detectNoise("Occasion Noise", summary);
            detectedNoise.push("Occasion Noise");
          }
        });

        const bertResponse = {
          text: `Detected Bias: ${bertData.predictions.join(", ")}`,
          sender: "BERT",
        };

        setMessages((prev) => [...prev, bertResponse]);
        saveChats(user, judgementId, [bertResponse], detectedBias, detectedNoise);
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
        saveChats(user, judgementId, [gptResponse], detectedBias, detectedNoise);
      } else if (gptData.error) {
        console.error(gptData.error || "ERROR, No response from GPT")
      }

      const levelNoiseData = await fetchLevelNoise(messageContent);
      if (levelNoiseData) {
        const { confidence_scores } = levelNoiseData;
        console.log("Level Noise Confidence Scores:", confidence_scores);

        const neutralScore = confidence_scores["neutral"];
        const harshScore = confidence_scores["harsh"];

        if (harshScore > neutralScore) {
          detectNoise("Level Noise", "Harsh decision making detected");
          detectedNoise.push("Level Noise");
        }

      }

      const patternNoiseData = await fetchPatternNoise(
        user.uid,
        judgementId,
        judgmentData.theme,
      );
  
      if (patternNoiseData) {
        const { similarDecisions } = patternNoiseData;
  
        if (similarDecisions && similarDecisions.length > 0) {
          console.log("Pattern Noise detected: Similar past decisions found.", similarDecisions);
          detectNoise("Pattern Noise");
          setSimilarDecisions(similarDecisions);
        } else {
          console.log("No Pattern Noise detected.");
          setSimilarDecisions([]);
        }
      }
      await saveChats(user, judgementId, [{ ...newMessage }], detectedBias, detectedNoise);

    } catch (error) {
      console.error("ERROR,Cant connect to BERT OR GPT", error.message || error)
    }
    setButtonDisable(false);
  };

  useEffect(() => {
    const fetchPreviosChats = async () => {
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

    fetchPreviosChats();
  }, [judgementId]);


  return (
    <div className="h-[425px]">
      <MessageList messages={messages} onSend={onSend} />
      <MessageSender input={input} setInput={setInput} onSend={onSend} buttonDisable={buttonDisable} />
    </div>

  );
};

export default Chat;
