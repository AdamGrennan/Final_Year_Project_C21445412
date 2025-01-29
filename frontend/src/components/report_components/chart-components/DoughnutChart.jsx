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

const DoughnutChart = ({ bias }) => {

  const mockBiasCount = {
    "Overconfidence Bias": 5,
    "Confirmation Bias": 8,
    "Anchoring Bias": 3,
    "Availability Bias": 6,
  };

  const biasCounts = bias.reduce((acc, bias) => {
    acc[bias] = (acc[bias] || 0) + 1; 
    return acc;
  }, {});


  const labels = Object.keys(biasCounts);
  const counts = Object.values(biasCounts);

  const total = counts.reduce((sum, count) => sum + count, 0);
  const percentages = counts.map((count) => Math.round((count / total) * 100));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Bias Occurrence (%)",
        data: percentages,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(153, 102, 255)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  if (bias.length === 0) {
    return <p>No data to display.</p>;
  }

  return <Doughnut data={data} />;
};

export default DoughnutChart;
