"use client";
import React from "react";
import PieChart from "./PieChart";
import { FaChartSimple } from "react-icons/fa6";

export const DecisionStats = ({
  total,
  levelNoise,
  pieData,
  topThemeWithBias,
  topThemeWithNoise,
  mostBiasedTime,
  noisiestTime,
}) => {

  const getLevelLabel = (avg) => {
    const val = parseFloat(avg);
    if (val < 0.5) return "Lenient";
    if (val > 1.5) return "Harsh";
    return "Neutral";
  };


  return (
    <div className="m-0 p-0">
      <div className="flex items-center">
        <FaChartSimple className="text-cyan-500 text-2xl mr-2" />
        <h2 className="text-lg font-urbanist font-semibold text-gray-800">Decision Statistics</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col gap-2 justify-center">
          <div className="w-full max-w-[500px]">
            <div className="bg-white p-4 space-y-3">
              <StatItem label="Total Decisions" value={total} />
              {total >= 3 && (
                <StatItem
                  label="Average Level Noise Score"
                  value={
                    levelNoise !== "N/A" && levelNoise !== null
                      ? `${levelNoise} (${getLevelLabel(levelNoise)})`
                      : "N/A"
                  }
                />
              )}
              <StatItem label="Most Biased Theme" value={topThemeWithBias || "N/A"} />
              <StatItem label="Noisiest Theme" value={topThemeWithNoise || "N/A"} />
              <StatItem label="Most Biased Time" value={mostBiasedTime || "N/A"} />
              <StatItem label="Noisiest Time" value={noisiestTime || "N/A"} />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-6 min-h-[250px] min-w-[300px]">
          <PieChart pieData={pieData} title="Distribution" />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => {
  let textColor = "text-gray-700";

  return (
    <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200 h-12">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${textColor}`}>{value}</span>
    </div>
  );
};
