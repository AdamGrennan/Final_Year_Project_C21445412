"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useDecision } from '@/context/DecisionContext';
import * as React from "react";
import Chat from "@/components/chat_components/Chat";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { fetchAdvice, fetchChatSummary } from '@/services/ApiService';
import { fetchChats } from '@/services/FirebaseService';
import { useUser } from '@/context/UserContext';
import { useJudgment } from '@/context/JudgementContext';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { uploadDashboardStats } from '@/utils/dashboardUtils/uploadDashboardStats';
import { EmojiPanel } from '@/components/chat_components/Emojis';
import { WebPanel } from '@/components/chat_components/WebPanel';

export default function Page() {
  const router = useRouter();
  const { judgementId } = useParams();
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const { detectedNoise, detectedBias, biasSources, noiseSources, setAdvice } = useDecision();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [isThinking, setIsThinking] = useState(false);


  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const finalReport = async () => {
    setIsLoading(true);

    const batch = writeBatch(db);

    if (!judgementId) {
      console.error("Error: judgementId is undefined.");
      setIsLoading(false);
      return;
    }

    const fbBias = Array.isArray(detectedBias) ? detectedBias.map(bias => ({
      bias,
      sources: Array.isArray(biasSources?.[bias]) ? biasSources[bias] : []
    })) : [];

    const fbNoise = Array.isArray(detectedNoise) ? detectedNoise.map(noise => ({
      noise,
      sources: Array.isArray(noiseSources?.[noise]) ? noiseSources[noise] : []
    })) : [];

    const judgeRef = doc(db, "judgement", judgementId);

    try {
      batch.update(judgeRef, {
        isCompleted: true,
        detectedBias: fbBias.length > 0 ? fbBias : [],
        detectedNoise: fbNoise.length > 0 ? fbNoise : [],
        updatedAt: serverTimestamp(),
      });

      const messages = await fetchChats(user, judgementId) || [];

      const response = await fetchAdvice(judgmentData.title, messages, detectedBias, detectedNoise);

      const chatSummary = await fetchChatSummary(judgmentData.title, messages, detectedBias, detectedNoise, biasSources, noiseSources);

      if (!response || !response.advice) {
        console.error("Error: fetchAdvice returned an invalid response:", response);
      } else if (!chatSummary) {
        console.error("Error: fetchChatSummary returned an invalid response:", chatSummary);
      } else {
        setAdvice(response.advice);
        batch.update(judgeRef, { advice: response.advice, chatSummary: chatSummary.chat_summary });
      }

      await batch.commit();
      await uploadDashboardStats(user.uid);
      router.push(`/Final_Report/${judgementId}`);

    } catch (error) {
      console.error("Firebase Batch Update Error:", error);
    }
  };

  return (
    <div className="flex flex-row w-full h-[485px] overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-PRIMARY"></div>
            <p className="mt-4 text-lg font-urbanist font-semibold text-gray-800">
              Report Generating{dots}
            </p>
          </div>
        </div>

      )}
      <div className="flex-1">
        <Chat judgementId={judgementId}
          setFinishButtonDisable={setButtonDisable}
          setIsThinking={setIsThinking}
        />
      </div>
      <div className="w-48 bg-white h-full flex flex-col p-4 border-l border-gray-200">

        <Label className="font-semibold text-base text-center mb-4">
          {judgmentData.title}
        </Label>
        <div className="mb-4">
          <EmojiPanel isThinking={isThinking} />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <WebPanel />
        </div>
        {buttonDisable && (
          <p className="mb-2 text-sm text-gray-500 text-center italic">
            Send at least 2 messages to unlock your final report.
          </p>
        )}
        <Button
          onClick={finalReport}
          disabled={buttonDisable}
          className="bg-PRIMARY text-white font-urbanist w-full hover:bg-opacity-80"
        >
          Finish
        </Button>
      </div>

    </div>
  );
};