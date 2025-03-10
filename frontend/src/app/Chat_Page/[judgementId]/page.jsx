"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useDecision } from '@/context/DecisionContext';
import * as React from "react";
import Chat from "@/components/chat_components/Chat";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { doc, serverTimestamp, writeBatch, getDoc } from "firebase/firestore";
import { fetchAdvice, fetchSummary, fetchChatSummary } from '@/services/ApiService';
import { fetchChats } from '@/services/FirebaseService';
import { useUser } from '@/context/UserContext';
import { useJudgment } from '@/context/JudgementContext';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';

export default function Page() {
  const router = useRouter();
  const { judgementId } = useParams();
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const { detectedNoise, detectedBias, biasSources, noiseSources, advice, setAdvice } = useDecision();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState("");

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
    const dashboardRef = doc(db, "dashboard", user.uid);

    try {
      batch.update(judgeRef, {
        isCompleted: true,
        detectedBias: fbBias.length > 0 ? fbBias : [], 
        detectedNoise: fbNoise.length > 0 ? fbNoise : [],
        updatedAt: serverTimestamp(),
      });

      const snapshot = await getDoc(dashboardRef);
      let existingStats = { biasOccurrences: {}, 
      noiseOccurrences: {}, 
      biasSources: {}, 
      noiseSources: {}, 
      totalDecisions: 0 };

      if (snapshot.exists()) {
        existingStats = snapshot.data();
      }

      const updatedBiasCounts = { ...existingStats.biasOccurrences };
      const updatedNoiseCounts = { ...existingStats.noiseOccurrences };
      const updatedBiasSources = { ...existingStats.biasSources };
      const updatedNoiseSources = { ...existingStats.noiseSources };
  
      detectedBias.forEach(bias => {
        updatedBiasCounts[bias] = (updatedBiasCounts[bias] || 0) + 1;
        if (biasSources[bias]) {
          biasSources[bias].forEach(source => {
            updatedBiasSources[source] = (updatedBiasSources[source] || 0) + 1;
          });
        }
      });
  
      detectedNoise.forEach(noise => {
        updatedNoiseCounts[noise] = (updatedNoiseCounts[noise] || 0) + 1;
        if (noiseSources[noise]) {
          noiseSources[noise].forEach(source => {
            updatedNoiseSources[source] = (updatedNoiseSources[source] || 0) + 1;
          });
        }
      });
 
      batch.set(dashboardRef, {
        userId: user.uid,
        totalDecisions: existingStats.totalDecisions + 1,
        biasOccurrences: updatedBiasCounts,
        noiseOccurrences: updatedNoiseCounts,
        biasSources: updatedBiasSources,  
        noiseSources: updatedNoiseSources, 
        lastUpdated: serverTimestamp(),
      }, { merge: true });

      const messages = await fetchChats(user, judgementId) || [];

      const response = await fetchAdvice(judgmentData.title, messages, detectedBias, detectedNoise);

      const chatSummary = await fetchChatSummary(messages, detectedBias, detectedNoise, biasSources, noiseSources);
      
      if (!response || !response.advice) {
        console.error("Error: fetchAdvice returned an invalid response:", response);
      }else if(!chatSummary){
        console.error("Error: fetchChatSummary returned an invalid response:", chatSummary);
      } else {
        setAdvice(response.advice); 
        batch.update(judgeRef, { advice: response.advice, chatSummary: chatSummary.chat_summary });
      }

      await batch.commit();
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
        <Chat judgementId={judgementId} setFinishButtonDisable={setButtonDisable}/>
      </div>
      <div className="w-48 bg-white h-full flex flex-col items-center justify-center p-4 border-l border-gray-200">
        <Label>
          {judgmentData.title}
        </Label>
        <div className="flex-grow"></div> 
        <p className="text-sm text-gray-600 text-center font-urbanist">
          Generate a comprehensive analysis based on your inputs.
        </p>
        <Button
          onClick={finalReport}
          disabled={!buttonDisable}
          className="bg-PRIMARY text-white font-urbanist mt-72 w-full  hover:bg-opacity-80"
        >
          Finish
        </Button>
        
      </div>
    </div>
  );
};