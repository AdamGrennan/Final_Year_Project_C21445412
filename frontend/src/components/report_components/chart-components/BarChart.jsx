import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ pastBiases, recentBiases, labels }) => {
    const data = {
        labels: labels,  
        datasets: [
            {
                label: "Past 10 Decisions",
                data: pastBiases,  
                backgroundColor: "rgba(75, 192, 192, 0.5)", 
            },
            {
                label: "Recent 10 Decisions",
                data: recentBiases,  
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="w-full h-[300px]">
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
