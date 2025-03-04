import { FaArrowUpLong } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BiSolidMicrophone } from "react-icons/bi";
import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import useSpeechToText from "@/hooks/useSpeechToText";

const MessageSender = ({ input, setInput, onSend, buttonDisable }) => {
  const [voicePopup, setVoicePopup] = useState(false);
  const { listening, transcript, startListening, stopListening } = useSpeechToText((finalText) => {
    setInput(finalText);
    onSend(finalText); 
    setVoicePopup(false); 
  });

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);
  

  const toggleVoicePopup = () => {
    setVoicePopup(!voicePopup);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSend();
    }
  };


  return (
    <>
    <div className="flex p-3 bg-GRAAY">
      <Input
        type="text"
        value={input}
        disabled={buttonDisable}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Enter Your Message..."
        className="font-urbanist flex-1 p-2.5 rounded-lg shadow-sm mr-2.5 bg-white border-none focus:border-SECONDARY focus:ring-SECONDARY focus:outline-none"
      />
      <Button className="bg-PRIMARY text-white w-8 h-8 rounded-full hover:bg-opacity-80 mr-2"
        onClick={() => onSend(input)}
        disabled={buttonDisable}>
        <FaArrowUpLong />
      </Button>

      <Button className="bg-PRIMARY text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-80"
         onClick={() => toggleVoicePopup()}
         disabled={buttonDisable}>
        <BiSolidMicrophone className="text-xl" />
      </Button>

    </div>
    {voicePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
            <Button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => {
                setVoicePopup(false);
                stopListening();
              }}>
              <IoCloseOutline className="text-2xl" />
            </Button>
            <h3 className="text-lg font-semibold">{listening ? "Listening..." : "Start Speaking"}</h3>
            <p className="mt-2 text-gray-500">{transcript || "Press below to start"}</p>
            <Button
              className={`mt-4 p-2 w-full rounded ${listening ? "bg-red-500" : "bg-PRIMARY"} text-white`}
              onClick={listening ? stopListening : startListening}>
              {listening ? "Stop Listening" : "Start Listening"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageSender;