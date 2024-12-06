"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Chat = () => {
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const onSend = async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: user.name }]);
    setInput("");

    try {
      const response = await fetch('http://127.0.0.1:5000/bert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      })

      const data = await response.json();
      console.log("BERT Response:", data);
      if (data.predictions) {

        const bertResponse = {
          text: `Detected Bias: ${data.predictions.join(', ')}`,
          sender: 'BERT',
        };
        console.log("Adding to messages:", bertResponse);
        setMessages((prev) => [...prev, bertResponse]);
      } else {
        console.error(data.error || "ERROR, No response from BERT")
      }

    } catch (error) {
      console.error("ERROR,Cant connect to BERT")
    }
  };

  return (
    <div className="flex flex-col w-[400px] h-[500px] rounded-md mx-auto bg-GRAAY">
      <div className="flex-1 p-4 overflow-y-auto bg-GRAAY">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`px-4 py-2 my-2 max-w-[80%] break-words rounded-lg 
              ${message.sender === "BERT"
                ? "bg-white text-black ml-auto"
                : "bg-PRIMARY text-white mr-auto"
              }`}
            style={{
              alignSelf: message.sender === "BERT" ? "flex-end" : "flex-start",
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
