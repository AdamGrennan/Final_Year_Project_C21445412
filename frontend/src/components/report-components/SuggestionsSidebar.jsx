"use client";
import { useEffect, useState } from "react";
import { fetchInsights } from "@/services/ApiService";
import { db } from "@/config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useDecision } from '@/context/DecisionContext';
import { TiTick } from "react-icons/ti";
import { IoIosWarning } from "react-icons/io";

export const SuggestionsSidebar = ({ chatSummaries, judgementId, isRevisited }) => {
  const { suggestions, setSuggestions } = useDecision();

  useEffect(() => {
    const getSummary = async () => {
      if (isRevisited || !chatSummaries?.currentChatSummary) return;

      try {
        const response = await fetchInsights({ chatSummary: chatSummaries.currentChatSummary });

        if (response && judgementId) {
          const judgementRef = doc(db, "judgement", judgementId);
          await updateDoc(judgementRef, {
            suggestions: response.suggestions || [],
          });

          setSuggestions(response.suggestions || []);
        }
      } catch (error) {
        console.error("Error fetching or saving summary:", error);
      }
    };

    getSummary();
  }, [chatSummaries, judgementId, isRevisited]);


  return (
    <div className="w-full bg-amber-50 border border-amber-300 rounded-md p-4 shadow-sm">
      <h3 className="font-urbanist text-amber-600 font-semibold text-base mb-2">
        Suggestions
      </h3>
      <div className="space-y-2">
        {suggestions.map((item, i) => (
          <details key={i} className="text-blue-800 text-sm leading-snug bg-blue-100 p-2 rounded-md">
            <summary className="cursor-pointer font-semibold">Suggestion {i + 1}</summary>
            <p className="mt-1">{item}</p>
          </details>
        ))}
      </div>
    </div>
  );
};
