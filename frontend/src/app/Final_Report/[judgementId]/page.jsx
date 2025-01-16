"use client";
import Breakdown from "@/components/Breakdown";
import { useRouter } from "next/navigation";
import FeedSideBar from "@/components/FeedSidebar";
import Snapshot from "@/components/Snapshot";
import SummarySideBar from "@/components/SummarySidebar";
import Trends from "@/components/Trends";
import { useDecision } from '@/context/DecisionContext';
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { useEffect } from "react";
import { writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Page() {
  const { biasCount, detectBias, detectNoise, breakdown, detectedBias, detectedNoise } = useDecision();
  const router = useRouter();
  const { judgementId } = useParams();
  const { user } = useUser();

  const openHome = () => {
    router.push('/Main');
  };

  const fetchBreakdown = async (judgementId) => {
    try {
      const judgeRef = doc(db, "judgement", judgementId);
      const docSnap = await getDoc(judgeRef);
      if (docSnap.exists()) {
        return docSnap.data().breakdown;
      } else {
        console.error("No breakdown found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching judgment breakdown:", error);
      return null;
    }
  };

  const finalReport = async () => {
    const detectedBiases = detectBias();
    const detectedNoise = detectNoise();
    const detectedBiasesArray = Array.from(new Set(detectedBiases));
    const detectedNoiseArray = Array.from(new Set(detectedNoise));

    console.log("Info at /sbert:", {
      user_id: user.uid,
      breakdown: breakdown,
      detectedBiases: detectedBiasesArray,
      detectedNoise: detectedNoiseArray,
    });

    const sBERT = await fetch('http://127.0.0.1:5000/sbert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.uid,
        breakdown: breakdown,
        detectedBiases: detectedBiasesArray,
        detectedNoise: detectedNoiseArray,
      }),
    });

    const { insights } = await sBERT.json();
    console.log("sBERT Response:", insights);

    if (insights.similarJudgments && insights.similarJudgments.length > 0) {
      console.log("Pattern Noise detected: Similar past decisions found.");
      detectNoise("Pattern Noise");
    } else {
      console.log("No Pattern Noise detected.");
    }

    const batch = writeBatch(db);

    const judgeRef = doc(collection(db, "judgement"));
    batch.update(judgeRef, {
      judgementId,
      insights: insights,
      detectedBias: detectedBiasesArray,
      detectedNoise: detectedNoiseArray,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  };

  useEffect(() => {
    finalReport();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex gap-8">

          <div className="flex flex-col w-full md:w-1/2 space-y-6">
            <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold">
              Summary
            </Label>
            <FeedSideBar bias={detectedBias} noise={detectedNoise} />
            <Snapshot />
          </div>

          <div className="flex flex-col w-full md:w-1/2 space-y-6">
            <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold">
              Analysis
            </Label>
            <Breakdown breakdown={breakdown} />
            <Trends />
          </div>

          <div className="flex flex-col w-full md:w-1/2 space-y-6">
            <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold">
              Feedback
            </Label>
            <SummarySideBar />
            <Button onClick={openHome} className="bg-PRIMARY text-white font-urbanist mt-4">
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
