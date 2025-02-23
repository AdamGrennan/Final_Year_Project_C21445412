import { useEffect, useState } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useParams, useSearchParams } from "next/navigation";
import { db } from "@/config/firebase";
import { useDecision } from '@/context/DecisionContext';

const useTrendData = () => {
  const [trends, setTrends] = useState([]);
  
  const searchParams = useSearchParams();
  const isRevisited = searchParams.get("revisited") === "true";
  const { judgementId } = useParams();

  useEffect(() => {
    const fetchTrendData = async () => {
      if (!judgementId) return;

      try {
        const trendRef = doc(db, "trends", judgementId);
        const trendSnap = await getDoc(trendRef);

        if (trendSnap.exists()) {
          const trendData = trendSnap.data();
          setTrends(trendData.trends || []);
          console.log("Fetched Trends:", trendData.trends);
        } else {
          console.warn("No trend data found for this decision.");
        }
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };

    if (isRevisited) {
      fetchTrendData();
    }
  }, [isRevisited, judgementId]);

  const saveTrends = async (detectedTrends) => {
    if (!judgementId || !detectedTrends.length) return;

    try {
      const trendRef = doc(db, "trends", judgementId);

      await setDoc(trendRef, {
        judgementId,
        trends: detectedTrends,
        createdAt: serverTimestamp(),
      });

      setTrends(detectedTrends);

      console.log("Trends successfully saved to Firestore!");
    } catch (error) {
      console.error("Error saving trends to Firestore:", error);
    }
  };

  return { trends, saveTrends };
};

export default useTrendData;
