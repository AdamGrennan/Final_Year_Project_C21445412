"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

const InteractCard = ({ onSaveFeedback }) => {
    const [feedback, setFeedback] = useState({
        helpful: null, 
        perspectiveChanged: null,
        reviewSimilar: null
    });

    const handleSelection = (key, value) => {
        setFeedback(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (onSaveFeedback) {
            onSaveFeedback(feedback);
        }
        console.log("Saved Feedback:", feedback); 
    };

    return (
        <div className="bg-white">
            <p className="mb-1 font-urbanist">Did you find this chat helpful?</p>
            <div className="flex space-x-2 mb-3">
                <Button
                    onClick={() => handleSelection("helpful", "Yes")}
                    className={`px-4 py-2 rounded-lg font-urbanist ${feedback.helpful === "Yes" ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
                >
                    Yes
                </Button>
                <Button
                    onClick={() => handleSelection("helpful", "No")}
                    className={`px-4 py-2 rounded-lg font-urbanist ${feedback.helpful === "No" ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
                >
                    No
                </Button>
                <Button
                    onClick={() => handleSelection("helpful", "Somewhat")}
                    className={`px-4 py-2 rounded-lg font-urbanist ${feedback.helpful === "Somewhat" ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
                >
                    Somewhat
                </Button>
            </div>

            <p className="mb-1 font-urbanist">Did this conversation change your perspective?</p>
            <div className="flex space-x-2 mb-3">
                <Button
                    onClick={() => handleSelection("perspectiveChanged", "Yes")}
                    className={`px-4 py-2 rounded-lg font-urbanist ${feedback.perspectiveChanged === "Yes" ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
                >
                    Yes
                </Button>
                <Button
                    onClick={() => handleSelection("perspectiveChanged", "No")}
                    className={`px-4 py-2 rounded-lg font-urbanist ${feedback.perspectiveChanged === "No" ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
                >
                    No
                </Button>
                <Button
                    onClick={() => handleSelection("perspectiveChanged", "Unsure")}
                    className={`px-4 py-2 rounded-lg ${feedback.perspectiveChanged === "Unsure" ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
                >
                    Unsure
                </Button>
            </div>
        </div>
    );
};

export default InteractCard;
