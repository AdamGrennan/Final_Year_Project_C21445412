"use client";
import { useEffect, useState } from "react";
import { fetchInsights } from "@/services/ApiService";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
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
          console.warn("chatSummaries is missing required fields.");
          return;
        }

        const { currentChatSummary, previousChatSummaries } = chatSummaries;

        if (previousChatSummaries.length < 2) {
          setShowInsights(true);
          return;
        }

        const trendRef = doc(db, "trends", judgementId);
        const trendSnapShot = await getDoc(trendRef);
        const trends = trendSnapShot.exists() ? trendSnap.data().trends : [];
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
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
        {showInsights ? (
          <p className="font-urbanist text-center text-gray-500 italic">
            Make 3 decisions to unlock personalized insights.
          </p>
        ) : isRevisited && strengths.length === 0 && improvements.length === 0 ? (
          <p className="font-urbanist text-center text-gray-500 italic">
            This decision was revisited, but no strengths or improvements were detected.
          </p>
        ) : (
          <ul className="list-disc list-inside text-sm space-y-2">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-300 rounded-md p-4 shadow-sm">
                <h3 className="font-urbanist text-green-600 font-semibold text-base flex items-center gap-2">
                  <span><TiTick /></span>
                  Strengths
                </h3>
                <div className="space-y-2 mt-2">
                  {strengths.map((item, i) => (
                    <p key={i} className="text-green-700 text-sm leading-snug">{item}</p>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-md p-4 shadow-sm">
                <h3 className="font-urbanist text-amber-500 font-semibold text-base flex items-center gap-2">
                  <span><IoIosWarning /></span>
                  Areas to Improve
                </h3>
                <div className="space-y-2 mt-2">
                  {improvements.map((item, i) => (
                    <p key={i} className="text-green-700 text-sm leading-snug">{item}</p>
                  ))}
                </div>
              </div>
            </div>

          </ul>
        )}
      </div>
    </div>
  );

};

export default InsightsSidebar;
