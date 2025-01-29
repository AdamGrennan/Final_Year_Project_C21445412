import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const LevelNoiseChart = ({ levelNoise }) => {
  const getColor = (percentage) => {
    if (percentage > 70) return "rgb(255, 99, 132)"; 
    if (percentage > 40) return "rgb(255, 205, 86)"; 
    return "rgb(54, 162, 235)"; 
  };

  const data = {
    labels: ["Level Noise", "Remaining"],
    datasets: [
      {
        data: [levelNoise, 100 - levelNoise], 
        backgroundColor: [getColor(levelNoise), "rgb(224, 224, 224)"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const drawTextPlugin = {
    id: "drawText",
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();

      const fontSize = (height / 250).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const text = `Level Noise \n${levelNoise}%`;
      const textX = width / 2;
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.restore();
    },
  };

  const options = {
    responsive: true,
    cutout: "85%", 
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <Doughnut className="w-[200px]" data={data} options={options} plugins={[drawTextPlugin]} />
    </div>
  );
};

export default LevelNoiseChart;
