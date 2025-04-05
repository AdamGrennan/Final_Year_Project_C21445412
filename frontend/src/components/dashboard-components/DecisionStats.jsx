"use client";
import React from "react";
import BiasPieChart from "./PieChart";

export const DecisionStats = ({
  total,
  pieData,
  topThemeWithBias,
  topThemeWithNoise,
  mostBiasedTime,
  noisiestTime,
}) => {
  return (
    <div className="m-0 p-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col space-y-6">
          <div className="w-full max-w-[500px]">
            <div className="bg-white p-4 space-y-3">
              <StatItem label="Total Decisions" value={total} />
              <StatItem label="Most Biased Theme" value={topThemeWithBias || "N/A"} />
              <StatItem label="Noisiest Theme" value={topThemeWithNoise || "N/A"} />
              <StatItem label="Most Biased Time" value={mostBiasedTime || "N/A"} />
              <StatItem label="Noisiest Time" value={noisiestTime || "N/A"} />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <BiasPieChart pieData={pieData} title="Bias Distribution" />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => {
  let textColor = "text-gray-700";

  return (
    <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${textColor}`}>{value}</span>
    </div>
  );
};
