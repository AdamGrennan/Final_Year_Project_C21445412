"use client"
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const FrequentTable = ({ data }) => {
 
  const getBarColor = (percentage) => { 
    if (percentage >= 75) return "#ff4d4d"; 
    if (percentage >= 50) return "#ffa500"; 
    return "#00ff80"; 
  };

  return (
    <div>
      <h2 className="font-urbanist font-semibold mb-2 border-b-[2px] border-PRIMARY pb-1 w-40">
        Most Frequent N&B
      </h2>
      <div className="flex justify-center gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md w-24"
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
            <p className="font-urbanist text-xs text-center mt-3 font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



