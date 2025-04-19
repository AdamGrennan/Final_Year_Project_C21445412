"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#FFB703", "#FB8500", "#023047", "#8ECAE6", "#219EBC", "#FF6B6B"];


const PieChart = ({ pieData }) => {
  console.log("Pie Data:", pieData);
  if (!pieData || pieData.length === 0) return <p className="text-sm text-center text-gray-400 italic">No data available.</p>;

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
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };
  

  return (
    <div className="bg-white p-4 w-[300px] self-start">
      <div className="w-full h-[300px]">
      <p className="text-md font-semibold mb-2 text-center">Bias & Noise Distribution</p>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
  
};

export default PieChart;
