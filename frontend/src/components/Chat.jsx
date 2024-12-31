"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBias } from "@/context/BiasContext";
import { collection, doc, getDocs, query, where, writeBatch, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

const Chat = ({ judgementId }) => {
  const { user } = useUser();
  const { countBias, detectBias } = useBias();

  const welcomeMessage = "Welcome to Sonus! I help you reflect on your judgments by analyzing noise and bias, detecting patterns, and providing feedback to improve your decision-making skills over time\n🧠 Receive insights on detected biases and potential noise.\n 📊 Review your decision trends and refine your approach.\n 🌟 Start typing to get started";
  const [messages, setMessages] = useState([{ text: welcomeMessage , sender: "GPT"}]);
  const [input, setInput] = useState("");

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      onSend();
    }
  };

  const saveChats = async (newMessages) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }
  
    if (!judgementId) {
      console.error("Judgement ID is missing");
      return;
    }
  
    try {
      const batch = writeBatch(db);
      console.log("Starting batch operation...");
  
      newMessages.forEach((msg, index) => {
        console.log(`Processing message #${index}:`, msg);
        const chatRef = doc(collection(db, "chat"));
        batch.set(chatRef, {
          judgementId,
          messages: msg,
          createdAt: serverTimestamp(),
          userId: user.uid,
        });
      });

    const detectedBiases = detectBias();
    if (detectedBiases && detectedBiases.length > 0) {
      const judgeRef = doc(db, "judgment", judgementId);
      batch.update(judgeRef, {
        biases: Array.from(new Set(detectedBiases)),
        updatedAt: serverTimestamp(),
      });
    }
  
      console.log("Committing batch...");
      await batch.commit();
      console.log("Batch commit successful");
    } catch (error) {
      console.error("Error saving chat:", error);
      alert("Failed to save chat.");
    }
  };
  

  const onSend = async () => {
    if (input.trim() === "") return;
    const newMessage = { text: input.trim(), sender: user.name, createdAt: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const responseBERT = await fetch('http://127.0.0.1:5000/bert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      })

      const bertData = await responseBERT.json();
      console.log("BERT Response:", bertData);

      if (bertData.predictions) {
        for(const bias of bertData.predictions){
          if(bias != "Neutral"){
            countBias(bias);
            detectBias(bias);  
          }
          
        }
        
        const bertResponse = {
          text: `Detected Bias: ${bertData.predictions.join(', ')}`,
          sender: 'BERT',
        };

        console.log("Adding to messages:", bertResponse);
       
        setMessages((prev) => [...prev, bertResponse]);
        saveChats([newMessage, bertResponse]);
      } else if(bertData.error){
        console.error(bertData.error || "ERROR, No response from BERT")      
      }

      const responseGPT = await fetch('http://127.0.0.1:5000/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      })
  
      const gptData = await responseGPT.json();
      console.log("GPT Response:", gptData);

      if (gptData.bias_feedback) {

        const gptResponse = {
          text: gptData.bias_feedback, 
          sender: "GPT",
        };
      
        console.log("Generated GPT Message:", gptResponse);
      
        setMessages((prev) => [...prev, gptResponse]);
      
        saveChats([newMessage, gptResponse]);
      }
       else if(gptData.error){
        console.error(gptData.error || "ERROR, No response from GPT")      
      }

    } catch (error) {
      console.error("ERROR,Cant connect to BERT OR GPT")
    }
  };

  //Logic for retreing chats
  useEffect(() => {
    const fetchChats = async () => {
    if (user && user.uid) { 
      try {
        const chatsQuery = query(
          collection(db, "chat"),
          where("judgementId", "==", judgementId),
          orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(chatsQuery);
        
        const fetchedMessages = querySnapshot.docs.map(doc => doc.data().messages).flat();
        setMessages((prev) => [...prev, ...fetchedMessages]);
        console.log("Fetched chats");
      } catch (error) {
        console.log(error);
      }
    }
    };
    fetchChats();
  }, [judgementId]);

  
  return (
    <div className="flex flex-col w-[750px] h-[450px] rounded-md mx-auto bg-GRAAY">
      <div className="flex-1 p-4 overflow-y-auto bg-GRAAY">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`px-4 py-2 my-2 max-w-[80%] break-words rounded-lg 
              ${message.sender === "BERT" || message.sender === "GPT"
                ? "bg-white text-black ml-auto"
                : "bg-PRIMARY text-white mr-auto"
              }`}
            style={{
              alignSelf: message.sender === "BERT" || message.sender === "GPT" ? "flex-end" : "flex-start",
            }}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="flex p-2.5 bg-GRAAY">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Message..."
          className="font-urbanist flex-1 p-2.5 rounded mr-2.5 bg-white border-none"
        />
        <Button className="bg-PRIMARY text-white rounded-md" onClick={onSend}>
          <FaArrowUpLong />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
