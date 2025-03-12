import { useRef, useEffect, useState } from "react";

const MessageList = ({ messages }) => {
    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };


    const formatText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-[100%] bg-GRAAY">
            <div className="flex-1 overflow-y-scroll h-[400px] p-4 scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
                <div className="flex flex-col gap-2">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 mb-2 break-words rounded-lg shadow-sm font-urbanist
                            ${message.sender === "BERT" || message.sender === "GPT" || message.sender === "System"
                                    ? "bg-white text-black ml-auto max-w-fit inline-block"
                                    : "bg-PRIMARY text-white mr-auto max-w-[80%] inline-block"
                                }`}
                            style={{
                                alignSelf: message.sender === "BERT" || message.sender === "GPT" || message.sender === "System"
                                    ? "flex-end"
                                    : "flex-start",
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: formatText(message.text) }}/>
                        </div>
                    ))}
                </div>
                <div ref={scrollRef}></div>
            </div>
        </div>
    );
}
export default MessageList;