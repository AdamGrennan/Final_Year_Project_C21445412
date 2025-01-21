import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const MessageList = ({messages, onSend}) => {
    const scrollRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState(null);
     const [buttonDisable, setButtonDisable] = useState(false);

    const scrollToBottom = () => {
        if (scrollRef) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-[100%] bg-GRAAY">
            <ScrollArea className="flex-1 overflow-y-auto h-[400px] p-4 scrollbar scrollbar-thumb-PRIMARY scrollbar-track-gray-200">
                <div>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 mb-2 max-w-[80%] break-words rounded-lg shadow-sm font-urbanist
            ${message.sender === "BERT" || message.sender === "GPT" || message.sender === "System"
                                    ? "bg-white text-black ml-auto"
                                    : "bg-PRIMARY text-white mr-auto"
                                }`}
                            style={{
                                alignSelf: message.sender === "BERT" || message.sender === "GPT" ? "flex-end" : "flex-start",
                            }}
                        >
                            {message.text}
                            {message.type === "prompt" && message.options && (
                                <div className="flex flex-col mt-2">
                                    {message.options.map((option, i) => (
                                        <Button
                                            key={i}
                                            className={`py-1 px-2 rounded-md ${selectedOption === option ? "bg-PRIMARY text-white" : "hover:bg-gray-400 bg-gray-200 text-black"}`}
                                            disabled={buttonDisable}
                                            onClick={() => {
                                                setSelectedOption(option)
                                                setButtonDisable(true)
                                                onSend(option)}
                                            }
                                        >
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div ref={scrollRef}></div>
            </ScrollArea>
        </div>
    );
}
export default MessageList;