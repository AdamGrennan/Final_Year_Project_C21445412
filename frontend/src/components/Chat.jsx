'use client'
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

const Chat = () => {
    const { user } = useUser();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const onSend = () => {
        if (input.trim() === '') return; 
        setMessages([...messages, { text: input, sender: user.name }]);
        setInput('');
    };


    return (
        <div style={styles.container}>
          <div style={styles.chatWindow}>
            {messages.map((message, index) => (
              <div key={index} style={styles.message}>
                <span style={styles.user}>{message.sender}:</span> {message.text}
              </div>
            ))}
          </div>
          <div style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button style={styles.button} onClick={onSend}>
              Send
            </button>
          </div>
        </div>
      );
    };
    

    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
        height: '500px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        margin: '50px auto',
        backgroundColor: '#f9f9f9',
      },
      chatWindow: {
        flex: 1,
        padding: '10px',
        overflowY: 'scroll',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
      },
      message: {
        padding: '5px 0',
      },
      user: {
        fontWeight: 'bold',
      },
      inputArea: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ddd',
      },
      input: {
        flex: 1,
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginRight: '10px',
      },
      button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      },
    };

export default Chat;