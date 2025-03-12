"use client";
import React from "react";
import { getDashboard } from "@/utils/getDashboard";
import { useState, useEffect } from "react";

export const DecisionStats = ({ user }) => {
    const [total, setTotal] = useState(0);
    const [weekly, setWeekly] = useState(0); 
    const [monthly, setMonthly] = useState(0); 

    useEffect(() => {
        if (user) {
          getDashboard(user).then((data) => {
            setTotal(data.totalDecisions);
          });
        }
      }, [user]);    

  return (
    <div className="w-[310px] h-[250px] bg-gray-100 rounded-lg shadow-md p-4 flex flex-col justify-between">
    <h2 className="font-urbanist font-semibold border-b-2 border-PRIMARY pb-1 w-fit">
        Decision Stats
      </h2>
      <div className="font-urbanist flex flex-col space-y-3">
        <StatItem label="Total Decisions" value={total} />
        <StatItem label="Decisions This Week" value={weekly} />
        <StatItem label="Decisions This Month" value={monthly} />
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex justify-between bg-white p-2 rounded-md shadow">
    <span className="text-sm font-medium">{label}</span>
    <span className="text-lg font-semibold text-PRIMARY">{value}</span>
  </div>
);

const Example = () => {
  return <DecisionStats total={54} weekly={10} monthly={32} />;
};

export default Example;
