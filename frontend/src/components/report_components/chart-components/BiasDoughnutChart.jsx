import { Doughnut } from "react-chartjs-2";
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

const BiasDoughnutChart = ({ bias = [] }) => {

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
        label: "Occurrence (%)",
        data: percentages,
        backgroundColor: [
          "rgb(0, 240, 181)",
          "rgb(246, 16, 103)",
          "rgb(255, 205, 86)",
          "rgb(153, 102, 255)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  if (bias.length === 0) {
    return <p className="text-center font-urbanist font-light">No Bias Data To Display.</p>;
  }

  return <Doughnut data={data} />;
};

export default BiasDoughnutChart;
