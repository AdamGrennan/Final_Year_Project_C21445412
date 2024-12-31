"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useBias } from '@/context/BiasContext';

import * as React from "react";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { useUser } from '@/context/UserContext';
import { doc, getDoc } from "firebase/firestore";

export default function Page() {
  const router = useRouter();
  const { judgementId } = useParams();
  const { countBias, detectBias } = useBias();
  const { user } = useUser();

  const fetchJudgmentDescription = async (judgementId) => {
    try {
      const judgeRef = doc(db, "judgement", judgementId);
      const docSnap = await getDoc(judgeRef);
      if (docSnap.exists()) {
        return docSnap.data().description;
      } else {
        console.error("No judgment found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching judgment description:", error);
      return null;
    }
  };

  const finalReport = async () => {
    const detectedBiases = detectBias();
    const detectedBiasesArray = Array.from(new Set(detectedBiases));

    const description = await fetchJudgmentDescription(judgementId);

    console.log("Info at /sbert:", {
      user_id: user.uid,
      description: description,
      detectedBiases: detectedBiasesArray,
    });
    

    const sBERT = await fetch('http://127.0.0.1:5000/sbert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: user.uid,
        description: description,
        detectedBiases: detectedBiasesArray, }),
    });

    const {insights} = await sBERT.json();
    console.log("sBERT Response:", sBERT);

    if (detectedBiasesArray && detectedBiasesArray.length > 0) {
      const batch = writeBatch(db);

      const judgeRef = doc(collection(db, "judgement"));
      batch.update(judgeRef, {
        judgementId,
        reflections: insights,
        biases: detectedBiasesArray,
        updatedAt: serverTimestamp(),
      });
    }
    router.push(`/Final_Report/${judgementId}`);
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex-1">
        <Chat judgementId={judgementId} />
      </div>
      <Button onClick={finalReport} className="bg-PRIMARY text-white font-urbanist">Final Insights</Button>
    </div>
  );
}