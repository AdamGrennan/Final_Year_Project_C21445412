import { Doughnut } from "react-chartjs-2";
import { useDecision } from "@/context/DecisionContext";
import {
  Chart as Chart,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register({
  ArcElement,
  Tooltip,
  Legend,
});

const NoiseDoughnutChart = ({ noise }) => {

  const mockNoiseCount = {
    "Patten Noise": 1,
    "Level Noise": 2,
  };

  const noiseCounts = noise.reduce((acc, noise) => {
    acc[noise] = (acc[noise] || 0) + 1; 
    return acc;
  }, {});

  const labels = Object.keys(noiseCounts);
  const counts = Object.values(noiseCounts);

  const total = counts.reduce((sum, count) => sum + count, 0);
  const percentages = counts.map((count) => Math.round((count / total) * 100));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Noise Occurrence (%)",
        data: percentages,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(14, 246, 176)",
          "rgb(153, 102, 255)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  if (noise.length === 0) {
    return <p>No noise data to display.</p>;
  }

  return <Doughnut data={data} />;
};

export default NoiseDoughnutChart;
