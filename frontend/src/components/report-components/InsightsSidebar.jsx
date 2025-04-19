"use client";
import { useEffect, useState } from "react";
import { fetchInsights } from "@/services/ApiService";
import { db } from "@/config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useDecision } from '@/context/DecisionContext';
import { TiTick } from "react-icons/ti";
import { IoIosWarning } from "react-icons/io";

const InsightsSidebar = ({ chatSummaries, judgementId, isRevisited }) => {
  const { strengths, improvements, setStrengths, setImprovements } = useDecision();
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const getSummary = async () => {
      if (isRevisited) return;

      try {
        if (!chatSummaries?.currentChatSummary || !chatSummaries?.previousChatSummaries) {
          return;
        }

        const { currentChatSummary, previousChatSummaries } = chatSummaries;

        if (previousChatSummaries.length < 2) {
          setShowInsights(true);
          return;
        }

        const trendRef = doc(db, "trends", judgementId);
        const trendSnapShot = await getDoc(trendRef);
        const trends = trendSnapShot.exists() ? trendSnapShot.data().trends : [];
        const response = await fetchInsights({ currentChatSummary, previousChatSummaries, trends });

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

    if (chatSummaries?.currentChatSummary && chatSummaries?.previousChatSummaries) {
      getSummary();
    }
  }, [chatSummaries, judgementId, isRevisited]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="flex-1 bg-green-50 border border-green-300 rounded-md p-4 shadow-sm">
        <h3 className="font-urbanist text-green-600 font-semibold text-base flex items-center gap-2">
          <TiTick />
          Strengths
        </h3>
        <div className="space-y-2 mt-2">
          {strengths.map((item, i) => (
            <p key={i} className="text-green-700 text-sm leading-snug">{item}</p>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-amber-50 border border-amber-300 rounded-md p-4 shadow-sm">
        <h3 className="font-urbanist text-amber-500 font-semibold text-base flex items-center gap-2">
          <IoIosWarning />
          Areas to Improve
        </h3>
        <div className="space-y-2 mt-2">
          {improvements.map((item, i) => (
            <p key={i} className="text-green-700 text-sm leading-snug">{item}</p>
          ))}
        </div>
      </div>
    </div>

  );

};

export default InsightsSidebar;
