import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/config/firebase";

const useTrendData = () => {
  const [fetchedTrends, setFetchedTrends] = useState([]);
  const { judgementId } = useParams();

  useEffect(() => {
    if (!judgementId) return;

    const trendRef = doc(db, "trends", judgementId);
    const unsubscribe = onSnapshot(trendRef, (snapshot) => {
      if (snapshot.exists()) {
        const trendData = snapshot.data();
        setFetchedTrends(trendData.trends || []);
        console.log("Trends Updated:", trendData.trends);
      } else {
        console.warn("Trends not available yet, waiting...");
      }
    });

    return () => unsubscribe(); 
  }, [judgementId]);

  return { fetchedTrends };
};

export default useTrendData;
