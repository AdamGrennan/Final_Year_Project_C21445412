"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const FrequentTable = ({ userId }) => {
  const [data, setData] = useState([]);

  const getBarColor = (percentage) => {
    if (percentage >= 75) return "#ff4d4d";
    if (percentage >= 40) return "#ffa500"; 
    return "#00ff80"; 
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, "dashboard", userId));
        if (userDoc.exists()) {
          const { biasDecisionCounts, noiseDecisionCounts, totalDecisions } = userDoc.data();

          if (totalDecisions > 0) {
            const allCounts = {
              ...biasDecisionCounts, 
              ...noiseDecisionCounts, 
            };

            const sortedData = Object.entries(allCounts)
              .map(([label, count]) => ({
                label,
                percentage: Math.round((count / totalDecisions) * 100),
              }))
              .sort((a, b) => b.percentage - a.percentage) 
              .slice(0, 3); 

            setData(sortedData);
          }
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <h2 className="font-urbanist font-semibold mb-2 border-b-[2px] border-PRIMARY pb-1 w-40">
        Top Noise & Bias
      </h2>
      <div className="flex justify-start gap-3">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="bg-white flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md w-24"
            >
              <div className="w-16 h-14 font-urbanist">
                <CircularProgressbar
                  value={item.percentage}
                  text={`${item.percentage}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: getBarColor(item.percentage),
                    textColor: "#000",
                    trailColor: "#e5e5e5",
                  })}
                />
              </div>
              <p className="font-urbanist text-xs text-center mt-3 font-medium">
                {item.label}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-gray-400 italic">No data available</p>
        )}
      </div>
    </div>
  );
};
