"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#FFB703", "#FB8500", "#023047", "#8ECAE6", "#219EBC", "#219EBC"];

const BiasPieChart = ({ pieData }) => {
  if (!pieData || pieData.length === 0) return <p>No bias data available.</p>;

  const chartData = {
    labels: pieData.map((item) => item.name),
    datasets: [
      {
        label: "Bias Count",
        data: pieData.map((item) => item.value),
        backgroundColor: COLORS.slice(0, pieData.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 w-[300px] self-start">
      <div className="w-full h-[300px]">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
  
};

export default BiasPieChart;
