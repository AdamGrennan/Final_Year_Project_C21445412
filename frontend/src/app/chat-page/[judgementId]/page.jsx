"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useDecision } from '@/context/DecisionContext';
import * as React from "react";
import Chat from "@/components/chat-components/Chat";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { fetchAdvice, fetchChatSummary, fetchLevelNoise, levelNoiseScores } from '@/services/ApiService';
import { fetchChats } from '@/services/FirebaseService';
import { useUser } from '@/context/UserContext';
import { useJudgment } from '@/context/JudgementContext';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { uploadDashboardStats } from '@/utils/dashboardUtils/uploadDashboardStats';
import { EmojiPanel } from '@/components/chat-components/Emojis';
import { WebPanel } from '@/components/chat-components/WebPanel';

export default function Page() {
  const router = useRouter();
  const { judgementId } = useParams();
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const { detectedNoise, detectedBias, biasSources, noiseSources, setAdvice, detectNoise } = useDecision();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [relatedLinks, setRelatedLinks] = useState([]);

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

    const messages = await fetchChats(user, judgementId) || [];
    const userScores = [];
    
    for (const msg of messages) {
      if (msg.sender === "user") {
        const result = await fetchLevelNoise(msg.text, user.uid, judgementId, false);
        const label = result.detected_label;
        const labelToScore = { lenient: 0, neutral: 1, harsh: 2 };
        const score = labelToScore[label] !== undefined ? labelToScore[label] : 1;
        userScores.push(score);
      }
    }
    
    let currentAvg = null;
    
    if (userScores.length > 0) {
      currentAvg = userScores.reduce((sum, s) => sum + s, 0) / userScores.length;
    
      await levelNoiseScores({
        action: "save",
        userId: user.uid,
        judgmentId: judgementId,
        score: currentAvg,
      });
    
      const result = await fetchLevelNoise("fetch_level_noise", user.uid, judgementId, false);
    
      if (result.type === "harsh" || result.type === "lenient") {
        detectNoise("Level Noise", result.message);
        detectedNoise.push("Level Noise");
      }
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
      router.push(`/final-report/${judgementId}`);

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
          setRelatedLinks={setRelatedLinks}
        />
      </div>
      <div className="w-64 bg-white h-full flex flex-col p-4 border-l border-gray-200">

        <Label className="font-semibold text-base text-center mb-4">
          {judgmentData.title}
        </Label>
        <div className="mb-4">
          <EmojiPanel isThinking={isThinking} />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <WebPanel links={relatedLinks} />
        </div>
        <Button
          onClick={finalReport}
          disabled={buttonDisable}
          className="bg-PRIMARY text-white font-urbanist w-full hover:bg-opacity-80"
        >
          View Report
        </Button>
      </div>

    </div>
  );
};