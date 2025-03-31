"use client";
import { useEffect, useState } from "react";
import { fetchSummary } from "@/services/ApiService";
import { db } from "@/config/firebase"; 
import { doc, updateDoc } from "firebase/firestore"; 
import { useDecision } from '@/context/DecisionContext';

const SummarySidebar = ({ chatSummaries, judgementId, isRevisited }) => {
  const { strengths, improvements, setStrengths, setImprovements } = useDecision(); 

  useEffect(() => {
    const getSummary = async () => {
      if (isRevisited) {
        return;
      }
      
      try {
        if (!chatSummaries || !chatSummaries.currentChatSummary || !chatSummaries.previousChatSummaries) {
          console.warn("chatSummaries is missing required fields.");
          return;
        }

        const { currentChatSummary, previousChatSummaries } = chatSummaries;

        const response = await fetchSummary({ currentChatSummary, previousChatSummaries });
        console.log("Fetched Summary:", response);

        if (response && judgementId) {
          const judgementRef = doc(db, "judgement", judgementId);
          await updateDoc(judgementRef, {
            strengths: response.Strengths || [],
            improvements: response.Improvements || [],
          });

          setStrengths(response.Strengths || []);
          setImprovements(response.Improvements || []);
        }
      } catch (error) {
        console.error("Error fetching or saving summary:", error);
      }
    };

    if (chatSummaries && chatSummaries.currentChatSummary && chatSummaries.previousChatSummaries) {
      getSummary();
    }
  }, [chatSummaries, judgementId, isRevisited]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
        <ul className="list-disc list-inside text-sm space-y-2">
          <h3 className="font-urbanist text-lg font-semibold text-green-300 mb-2">Strengths</h3>
          {strengths.length > 0 && strengths.map((key, index) => (
            <p key={index} className="font-urbanist">{key}</p>
          ))}
          <h3 className="font-urbanist text-lg font-semibold text-red-300 mb-2">Areas to Improve</h3>
          {improvements.length > 0 && improvements.map((key, index) => (
            <p key={index} className="font-urbanist">{key}</p>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default SummarySidebar;