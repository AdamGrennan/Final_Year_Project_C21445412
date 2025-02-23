"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../../ui/button";
import { db } from "@/config/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { MdKeyboardDoubleArrowUp, MdOutlineKeyboardDoubleArrowDown, MdNewReleases } from "react-icons/md";
import { AiFillFire } from "react-icons/ai";
import useTrendData from "@/hooks/useTrendData";
import { useSearchParams } from "next/navigation";

const Trends = ({ user, jid, bias, noise }) => {
  const searchParams = useSearchParams();
  const isRevisited = searchParams.get("revisited") === "true";
  const { trends, saveTrends } = useTrendData();

  useEffect(() => {
    console.log("Current Trends State:", trends);
  }, [trends]);
  
  const newOccurence = (allDecisions, bias, noise) => {
    let detectedTrends = [];
  
    if (allDecisions.length === 0) {
      bias.forEach((b) => {
        detectedTrends.push({ message: `${b} was detected for the first time!`, type: "new" });
      });
  
      noise.forEach((n) => {
        detectedTrends.push({ message: `${n} was detected for the first time!`, type: "new" });
      });
  
      return detectedTrends;
    }
  
    const lastDecision = allDecisions[0];
    
    const pastBias = new Set(allDecisions.slice(1).flatMap((d) => d.detectedBias?.map(b => b.bias) || []));
    const pastNoise = new Set(allDecisions.slice(1).flatMap((d) => d.detectedNoise?.map(n => n.noise) || []));

    console.log("Extracted Past Noises:", [...pastNoise]);
    console.log("Current Decision Noises:", noise);

    bias.forEach((b) => {
      if (!pastBias.has(b)) {
        console.log(`New Bias Detected in this Decision: ${b}`);
        detectedTrends.push({ message: `${b} was detected for the first time in this decision!`, type: "new" });
      }
    });
  
    noise.forEach((n) => {
      if (!pastNoise.has(n)) {
        console.log(`New Noise Detected in this Decision: ${n}`);
        detectedTrends.push({ message: `${n} was detected for the first time in this decision!`, type: "new" });
      }
    });
  
    console.log("Final Detected New Trends:", detectedTrends);
    return detectedTrends;
  };

  const percentageChange = (allDecisions, key) => {
    if (allDecisions.length < 2) return [];

    const mid = Math.ceil(allDecisions.length / 2);
    const recentDecisions = allDecisions.slice(0, mid);
    const pastDecisions = allDecisions.slice(mid);

    const countOccurrences = (decisions) =>
      decisions.reduce((acc, decision) => {
        (decision[key] || []).forEach((item) => {
          const name = item.bias || item.noise;
          if (name) {
            acc[name] = (acc[name] || 0) + 1;
          }
        });
        return acc;
      }, {});

    const recentCounts = countOccurrences(recentDecisions);
    const pastCounts = countOccurrences(pastDecisions);

    let detectedTrends = [];

    Object.keys(recentCounts).forEach((biasOrNoise) => {
      const prevCount = pastCounts[biasOrNoise] || 0;
      const currentCount = recentCounts[biasOrNoise] || 0;

      if (prevCount > 0) {
        const change = ((currentCount - prevCount) / prevCount) * 100;

        if (change > 0) {
          detectedTrends.push({ message: `${biasOrNoise} increased by ${change.toFixed(1)}%`, type: "increase" });
        } else if (change < 0) {
          detectedTrends.push({ message: `${biasOrNoise} decreased by ${Math.abs(change.toFixed(1))}%`, type: "decrease" });
        }
      }
    });

    return detectedTrends;
  };

  const decisionStreaks = (allDecisions, allBiases, allNoises) => {
    if (allDecisions.length < 3) return []; 
  
    let detectedTrends = [];

    allDecisions.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
  
    const lastThreeDecisions = allDecisions.slice(-3);

    const pastBiases = new Set();
    const pastNoises = new Set();
  
    lastThreeDecisions.forEach((d) => {
      (d.detectedBias || []).forEach((b) => pastBiases.add(b.bias));
      (d.detectedNoise || []).forEach((n) => pastNoises.add(n.noise));
    });

    allBiases.forEach((b) => {
      if (!pastBiases.has(b)) {
        detectedTrends.push({ message: `${b} has NOT been detected in the last 3 decisions!`, type: "streak" });
      }
    });
  
    allNoises.forEach((n) => {
      if (!pastNoises.has(n)) {
        detectedTrends.push({ message: `${n} has NOT been detected in the last 3 decisions!`, type: "streak" });
      }
    });
  
    console.log("Final Detected Streaks:", detectedTrends);
    return detectedTrends;
  };

  useEffect(() => {
    const fetchTrends = async () => {
      if (!user || !user.uid || isRevisited || !jid) return;
    
      try {
        const decisionsQuery = query(
          collection(db, "judgement"),
          where("userId", "==", user.uid),
          where("isCompleted", "==", true),
          orderBy("createdAt", "desc"),
          limit(20)
        );
    
        const querySnapshot = await getDocs(decisionsQuery);
        let allDecisions = querySnapshot.docs.map((doc) => doc.data());
    
        allDecisions = allDecisions.filter(d => d.id !== jid);
    
        const allBiases = [...new Set(allDecisions.flatMap(d => d.detectedBias?.map(b => b.bias) || []))];
        const allNoises = [...new Set(allDecisions.flatMap(d => d.detectedNoise?.map(n => n.noise) || []))];
    
        const detectedTrends = [
          ...newOccurence(allDecisions, bias, noise),
          ...percentageChange(allDecisions, "detectedBias"),
          ...percentageChange(allDecisions, "detectedNoise"),
          ...decisionStreaks(allDecisions, allBiases, allNoises) 
        ];
    
        console.log("Detected Trends:", detectedTrends);
    
        const uniqueTrends = Array.from(new Map(detectedTrends.map(trend => [trend.message, trend])).values());
    
        if (uniqueTrends.length > 0) {
          await saveTrends(uniqueTrends);
        }
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };
  
    fetchTrends();
  }, [user?.uid, isRevisited]);

  const iconMap = {
    new: <MdNewReleases className="text-SECONDARY" />,
    increase: <MdKeyboardDoubleArrowUp style={{ color: "red" }} />,
    decrease: <MdOutlineKeyboardDoubleArrowDown style={{ color: "green" }} />,
    streak: <AiFillFire className="text-PRIMARY" />
  };

  return (
    <div>
      <ScrollArea>
        <div className="flex flex-col text-gray-500">
          {trends.length === 0 ? <p>No trends detected</p> :
            trends.map((trend, index) => (
              <Button key={index} className="w-full text-left">{iconMap[trend.type]} {trend.message}</Button>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Trends;
