"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useDecision } from '@/context/DecisionContext';

import * as React from "react";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { writeBatch } from 'firebase/firestore';
import { doc, getDoc, collection, serverTimestamp} from "firebase/firestore";


export default function Page() {
  const router = useRouter();
  const { judgementId } = useParams();
  const { setBreakdown } = useDecision();

  const finalReport = async () => {
    const response = await fetch('http://127.0.0.1:5000/generate_breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judgementId: judgementId }),
    })
  
    const data = await response.json();
    
    const batch = writeBatch(db);

    const judgeRef = doc(db, "judgement", judgementId);
      batch.update(judgeRef, {
        breakdown: data.breakdown,
        updatedAt: serverTimestamp(),
      });
      await batch.commit()

      setBreakdown(data.breakdown);

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