"use client"
import React from "react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { db } from "@/config/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { MdNewReleases } from "react-icons/md";

const Trends = ({ user, bias, noise }) => {
  const sampleTrends = ["Overconfidence Bias detected in 40% of your decisions"];
  const [trends, setTrends] = useState([]);
  const theme = "theme";

  useEffect(() => {
    const fetchTrends = async () => {
      if (!user || !user.uid) return;

      try {
        const decisionsQuery = query(
          collection(db, "judgement"),
          where("userId", "==", user.uid),
          where("isCompleted", "==", true),
          orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(decisionsQuery);
        const pastDecisions = querySnapshot.docs.map((doc) => doc.data());

        if (pastDecisions.length === 0) return;

        const pastBias = new Set(pastDecisions.flatMap((d) => d.detectedBias || []));
        const pastNoise = new Set(pastDecisions.flatMap((d) => d.detectedNoise || []));

        let detectedTrends = []

        bias.forEach((b) => {
          if(!pastBias.has(b)){
            detectedTrends.push(`{b} was detected for the first time!`)
          }
        });

        noise.forEach((n) => {
          if(!pastNoise.has(n)){
            detectedTrends.push(`{n} was detected for the first time!`)
          }
        });

      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };

    fetchTrends();
  }, [user, bias, noise]);

  const iconMap = {
    increase: <MdKeyboardDoubleArrowUp style={{ color: "green" }} />,
    decrease: <MdOutlineKeyboardDoubleArrowDown style={{ color: "red" }} />,
  };

  return (
    <div>
      <ScrollArea>
        <div className="flex flex-col text-gray-500">
          {sampleTrends.length === 0 ? (
            <div className="flex flex-col text-gray-500">
              <p className="text-sm font-urbanist font-light">No trends detected</p>
            </div>
          ) : (
            sampleTrends.map((decision) => (
              <div className="flex items-center justify-start">
                <Button
                  className="w-full text-left bg-GRAAY text-black rounded-md font-urbanist h-auto mb-4"
                >
                  <div className="flex flex-col w-full font-light text-sm break-words whitespace-normal">
                    {decision}
                  </div>
                  <MdNewReleases className="text-SECONDARY"/>
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