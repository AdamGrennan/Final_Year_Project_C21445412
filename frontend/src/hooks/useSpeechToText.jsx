import { useState, useRef, useEffect } from "react";

const useSpeechToText = (onSpeechComplete, options = {}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.error("Web Speech API not supported");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || false;
    recognition.lang = options.lang || "en-US";

    if ("webkitSpeechGrammarList" in window) {
      const speechRecognitionList = new window.webkitSpeechGrammarList();
      const grammar = "#JSGF V1.0;";
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
    }

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        setListening(false);
        if (transcript.trim()) {
          onSpeechComplete(transcript);
          setTranscript(""); 
        }
      };

    return () => {
      recognition.stop();
    };
  }, [transcript, onSpeechComplete]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setTranscript(""); 
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return {
    listening,
    transcript,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
