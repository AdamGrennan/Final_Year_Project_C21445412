"use client";
import { useState } from "react";
import { db } from "@/config/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { newOccurrence, percentageChange, decisionStreaks } from "./trendStats";
import useTrendData from "@/hooks/useTrendData";

const useFetchTrends = (user, jid, bias, noise) => {
  const { trends, saveTrends } = useTrendData();
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    if (!user || !user.uid || !jid) return;

    setLoading(true);
    try {
      const decisionsQuery = query(
        collection(db, "judgement"),
        where("userId", "==", user.uid),
        where("isCompleted", "==", true),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const querySnapshot = await getDocs(decisionsQuery);
      let allDecisions = querySnapshot.docs.map((doc) => doc.data()).filter(d => d.id !== jid);

      const allBiases = [...new Set(allDecisions.flatMap(d => d.detectedBias?.map(b => b.bias) || []))];
      const allNoises = [...new Set(allDecisions.flatMap(d => d.detectedNoise?.map(n => n.noise) || []))];

      const detectedTrends = [
        ...newOccurrence(allDecisions, bias, noise),
        ...percentageChange(allDecisions, "detectedBias"),
        ...percentageChange(allDecisions, "detectedNoise"),
        ...decisionStreaks(allDecisions, allBiases, allNoises)
      ];

      const uniqueTrends = Array.from(new Map(detectedTrends.map(trend => [trend.message, trend])).values());

      if (uniqueTrends.length > 0) {
        await saveTrends(uniqueTrends);
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
    setLoading(false);
  };

  return { trends, fetchTrends, loading };
};

export default useFetchTrends;
