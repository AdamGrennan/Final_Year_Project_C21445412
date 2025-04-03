"use client";
import { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, query, where, orderBy, getDocs, limit, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  newOccurrence,
  frequencyChange,
  absentStreaks,
  detectionStreaks,
  topFrequentTrends
} from "./TrendStats";


const useTrendAnalysis = (user, jid, bias, noise) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrends();
  }, [jid]);

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
        ...frequencyChange(allDecisions, "detectedBias"),
        ...frequencyChange(allDecisions, "detectedNoise"),
        ...absentStreaks(allDecisions, allBiases, allNoises),
        ...detectionStreaks(allDecisions),
        ...topFrequentTrends(allDecisions, "detectedBias"),
        ...topFrequentTrends(allDecisions, "detectedNoise")

      ];

      const uniqueTrends = Array.from(new Map(detectedTrends.map(trend => [trend.message, trend])).values());

      console.log("Trends before saving:", uniqueTrends);

      setTrends(uniqueTrends);

      if (uniqueTrends.length > 0) {
        await saveTrends(uniqueTrends);
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
    setLoading(false);
  };


  const saveTrends = async (detectedTrends) => {
    if (!jid || !detectedTrends.length) return;

    try {
      const trendRef = doc(db, "trends", jid);

      await setDoc(trendRef, {
        jid,
        trends: detectedTrends,
        createdAt: serverTimestamp(),
      });

      setTrends(detectedTrends);

      console.log("Trends successfully saved to Firestore!");
    } catch (error) {
      console.error("Error saving trends to Firestore:", error);
    }
  };

  return { trends, fetchTrends, loading };
};



export default useTrendAnalysis;
