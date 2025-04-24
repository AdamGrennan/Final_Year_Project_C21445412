"use client";
import { useEffect } from "react";
import { fetchInsights } from "@/services/ApiService";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useDecision } from '@/context/DecisionContext';

export const SuggestionsSidebar = ({ chatSummaries, judgementId, isRevisited }) => {
  const { suggestions, setSuggestions } = useDecision();

  useEffect(() => {
    const getSummary = async () => {
      if (isRevisited || !chatSummaries?.currentChatSummary) return;

      try {
        const response = await fetchInsights({ chatSummary: chatSummaries.currentChatSummary });

        if (response && response.suggestions && judgementId) {
          const judgementRef = doc(db, "judgement", judgementId);
          await updateDoc(judgementRef, {
            suggestions: response.suggestions,
          });

          setSuggestions(response.suggestions);
        }
      } catch (error) {
        console.error("Error fetching or saving summary:", error);
      }
    };

    if (!isRevisited) {
      getSummary();
    }
  }, [chatSummaries, judgementId, isRevisited]);

  return (
    <div className="w-full rounded-md p-2 shadow-sm">
      <div className="space-y-2">
        {suggestions?.map((item, i) => (
          <div key={i} className="text-white text-sm leading-snug bg-SECONDARY p-3 rounded-md">
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
