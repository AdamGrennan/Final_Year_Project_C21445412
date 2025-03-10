"use client"
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const FrequentTable = ({ data }) => {
  return (
    <div className="w-full">
      <h2 className="font-urbanist font-semibold mb-2 border-b-[2px] border-PRIMARY pb-1">
        Most Frequent N&B
      </h2>
      <div className="flex justify-between space-x-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md w-24"
          >
            <div className="w-16 h-16">
              <CircularProgressbar
                value={item.percentage}
                text={`${item.percentage}%`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: "#00ff80",
                  textColor: "#000",
                  trailColor: "#e5e5e5",
                })}
              />
            </div>
            <p className="text-xs text-center mt-2 font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



