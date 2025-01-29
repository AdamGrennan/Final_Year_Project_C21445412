"use client"
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { db } from "@/config/firebase";
import { collection, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

const Trends = ( { user, bias, noise}) => {
  const sampleTrends = ["Overconfidence Bias detected in 40% of your decisions"];

  const addStats = async () => {
    try{
      const dashboardRef = await addDoc(collection(db, "dashboard"), user.uid);
      await updateDoc(dashboardRef, {
            overallDetectedBias: bias,
            overallDetectedNoise: noise,
            updatedAt: serverTimestamp(),
          });
    }catch(error){
      alert("Failed to update user dashboard stats");
    }
  }

  const fetchTrends = async () => {
        if (user && user.uid) {
          try {
            console.log("Fetching judgements with filter:", filter, "for userId:", user.uid);
            const judgementsQuery = query(
              collection(db, "judgement"),
              where("userId", "==", user.uid),
              where("isCompleted", "==", filter)
            );
            const querySnapshot = await getDocs(judgementsQuery);
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setJudgements(data);
            console.log("Fetched judgments:", data);
          } catch (error) {
            console.log(error);
          }
        }
  }
  
  return (
    <div>
      <ScrollArea>
        <div className="flex flex-col text-gray-500">
          {sampleTrends.length === 0 ? (
            <div className="flex flex-col text-gray-500">
              <p className="text-sm font-urbanist font-light">No frequent trends detected</p>
            </div>
          ) : (
            sampleTrends.map((decision) => (
              <div className="flex items-center justify-start">
                <Button
                  className="w-full text-left bg-GRAAY text-black rounded-md font-urbanist h-auto mb-4"
                >
                  <div className="flex flex-col w-full">
                    {decision}
                  </div>
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Trends;