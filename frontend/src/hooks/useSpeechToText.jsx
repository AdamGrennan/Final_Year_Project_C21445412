import { useState, useRef, useEffect } from "react";

const useSpeechToText = (onSpeechComplete, options = {}) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const manualStop = useRef(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.error("Web Speech API not supported");
      return;
    }

    if(!recognitionRef.current){
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
    }
 

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

    let finalTranscript = "";

    recognition.onresult = (event) => {
        finalTranscript = event.results[event.results.length - 1][0].transcript;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        setListening(false);

        if(manualStop.current){
            manualStop.current = false;
            return;
        }

        if (finalTranscript .trim()) {
          onSpeechComplete(finalTranscript);
        }
      };

    return () => {
      recognition.stop();
    };
  }, [onSpeechComplete]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      try {
        manualStop.current = false;
        recognitionRef.current.start();
        setListening(true);
      } catch (error) {
        console.error("SpeechRecognition start failed:", error);
      }
    }
  }; 

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      manualStop.current = true;
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return {
    listening,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
