import { useRef, useEffect, useState } from "react";
import { marked } from "marked";

const MessageList = ({ messages }) => {
    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    
    const formatText = (text) => {
        let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        formatted = formatted.replace(/-\s+/g, "\n- ");
      
        const lines = formatted.split("\n");
        let inList = false;
        const htmlLines = [];
      
        lines.forEach((line) => {
          if (line.trim().startsWith("- ")) {
            if (!inList) {
              htmlLines.push(
                "<ul style='padding-left: 1rem; margin-top: 0.5rem; margin-bottom: 0.5rem; list-style-type: disc;'>"
              );
              inList = true;
            }
            htmlLines.push(`<li style="margin-bottom: 0.5rem;">${line.substring(2).trim()}</li>`);
          } else {
            if (inList) {
              htmlLines.push("</ul>");
              inList = false;
            }
            htmlLines.push(`<p style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${line.trim()}</p>`);
          }
        });
      
        if (inList) htmlLines.push("</ul>");
      
        return htmlLines.join("");
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
                                    : "bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY from-30% via-50% to-90% text-white mr-auto max-w-[80%] inline-block"
                                }`}
                            style={{
                                alignSelf: message.sender === "BERT" || message.sender === "GPT" || message.sender === "System"
                                    ? "flex-end"
                                    : "flex-start",
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
                        </div>
                    ))}
                </div>
                <div ref={scrollRef}></div>
            </div>
        </div>
    );
}
export default MessageList;