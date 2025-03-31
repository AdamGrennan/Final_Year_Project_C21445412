"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { uploadFeedback } from "@/utils/decisionUtils/uploadFeedback";

const InteractCard = ({user, decision, isRevisited}) => {
    const [submit, setSubmit] = useState(false);
    const [feedback, setFeedback] = useState({
        helpful: null, 
        perspectiveChanged: null,
    });

    const handleSelection = (key, value) => {
        setFeedback(prev => ({ ...prev, [key]: value }));
    };

    const onSubmit = async () => {
        if(feedback.helpful && feedback.perspectiveChanged){
            await uploadFeedback(user, decision, feedback);
            setSubmit(true);
            console.log("Saved Feedback:", feedback); 
        }
    };

    const isSubmitDisable = !(feedback.helpful && feedback.perspectiveChanged);
    return (
        <div className="bg-white flex flex-col items-center justify-center text-center w-full">
            {isRevisited ? (
                <p className="font-urbanist text-gray-500">Feedback is not available for revisited decisions.</p>
            ) : (
                !submit ? (
                    <>
                        <p className="mb-1 font-urbanist">Did you find this chat helpful?</p>
                        <div className="flex space-x-2 mb-3">
                            {["Yes", "No", "Somewhat"].map((option) => (
                                <Button
                                    key={option}
                                    onClick={() => handleSelection("helpful", option)}
                                    className={`px-4 py-2 rounded-lg font-urbanist ${
                                        feedback.helpful === option ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"
                                    }`}>
                                    {option}
                                </Button>
                            ))}
                        </div>
                        <p className="mb-1 font-urbanist">Did this conversation change your perspective?</p>
                        <div className="flex space-x-2 mb-3">
                            {["Yes", "No", "Unsure"].map((option) => (
                                <Button
                                    key={option}
                                    onClick={() => handleSelection("perspectiveChanged", option)}
                                    className={`px-4 py-2 rounded-lg font-urbanist ${
                                        feedback.perspectiveChanged === option ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"
                                    }`}>
                                    {option}
                                </Button>
                            ))}
                        </div>
                        <Button
                            onClick={onSubmit}
                            disabled={isSubmitDisable}
                            className="w-1/2 font-urbanist py-4 mt-8 text-white bg-PRIMARY hover:bg-opacity-80 rounded-md"
                        >
                            Submit
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-4 space-x-2 justify-center items-center text-PRIMARY">
                        <BiSolidBadgeCheck size={24} />
                        <p className="font-urbanist text-lg">Thank You For Your Feedback!</p>
                    </div>
                )
            )}
        </div>
    );
    
};

export default InteractCard;
