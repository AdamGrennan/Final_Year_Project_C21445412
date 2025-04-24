import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const COLORS = ["#FFB703", "#FB8500", "#023047", "#8ECAE6", "#219EBC", "#FF6B6B", "#FFADAD"];

const BarChart = ({ bias = [], noise = [] }) => {
  const biasCounts = bias.reduce((acc, b) => {
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  const noiseCounts = noise.reduce((acc, n) => {
    acc[n] = (acc[n] || 0) + 1;
    return acc;
  }, {});

  const allLabels = [...new Set([...Object.keys(biasCounts), ...Object.keys(noiseCounts)])];

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: 'Detections',
        data: allLabels.map(label => biasCounts[label] || noiseCounts[label] || 0),
        backgroundColor: COLORS.slice(0, 7),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      x: {
        duration: 1000,
        easing: 'easeOutQuart',
        from: 0,
      },
    },
    
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        grid: { display: false },
        ticks: { stepSize: 1 },
      },
      y: {
        grid: { display: false },
        ticks: {
          padding: 6,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        barThickness: 'flex',
      },
    },
  };

  return (
    <div className="font-urbanist">

      <Bar data={data} options={options}  width={275} height={275}/>
    </div>
  );
};

export default BarChart;
