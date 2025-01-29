"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useDecision } from '@/context/DecisionContext';
import * as React from "react";
import Chat from "@/components/chat_components/Chat";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { writeBatch } from 'firebase/firestore';
import { doc, serverTimestamp } from "firebase/firestore";
import * as Progress from "@radix-ui/react-progress";
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const router = useRouter();
  const { judgementId } = useParams();
  const { setBreakdown, detectedNoise , detectedBias } = useDecision();
  const [fade, setFade] = useState(false);
  const { toast } = useToast()

  const finalReport = async () => {

    const response = await fetch('http://127.0.0.1:5000/generate_breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judgementId: judgementId }),
    })

    const data = await response.json();
    console.log("Detected Bias:", detectedBias);
    console.log("Detected Noise:", detectedNoise);

    const batch = writeBatch(db);

    const judgeRef = doc(db, "judgement", judgementId);
    batch.update(judgeRef, {
      breakdown: data.breakdown,
      isCompleted: true,
      detectedBias: detectedBias,
      detectedNoise: detectedNoise,
      updatedAt: serverTimestamp(),
    });
    await batch.commit()

    setBreakdown(data.breakdown);

    router.push(`/Final_Report/${judgementId}`);
  
  };

  return (
    <div className="flex flex-row w-full h-[485px] overflow-hidden">
      <div className="flex-1">
        <Chat judgementId={judgementId}/>
      </div>
      <div className="w-64 bg-white h-full flex flex-col items-center justify-center p-4 border-l border-gray-200">
        <Button
          onClick={finalReport}
          className="bg-PRIMARY text-white font-urbanist mt-72 w-full"
        >
          Final Insights
        </Button>
        <p className="text-sm text-gray-600 text-center font-urbanist">
          Generate a comprehensive analysis based on your inputs.
        </p>
      </div>
      <Toaster className="bg-white"/>
    </div>
  );
};