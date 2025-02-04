import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = ({ bias, noise }) => {
    const labels = ["Decision 1", "Decision 2", "Decision 3", "Decision 4", "Decision 5", "Decision 6", "Decision 7"];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Bias Frequency',
                data: bias,
                fill: false,
                borderColor: 'rgb(75, 192, 192)', 
                tension: 0.1
            },
            {
                label: 'Noise Frequency',
                data: noise, 
                fill: false,
                borderColor: 'rgb(255, 99, 132)', 
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: "#000" },
                grid: { display: false },
            },
            y: {
                ticks: { color: "#000" },
                grid: { color: "#ddd" },
            }
        },
        plugins: {
            legend: { position: "top", labels: { color: "#000" } }
        }
    };

    return (
        <div className="w-[500px] h-[300px] bg-transparent border-none">
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
