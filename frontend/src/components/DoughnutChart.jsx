import { Doughnut } from "react-chartjs-2";
import { useDecision } from '@/context/DecisionContext';
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

const DoughnutChart = () => {
    const { biasCount } = useDecision();
    
    const labels = Object.keys(biasCount);
    const values = Object.values(biasCount);

      const data = {
        labels: labels,
        datasets: [{
          label: 'Bias Occurence',
          data: values,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            "rgb(153, 102, 255)",
          ],
          hoverOffset: 4
        }]
      };

      return(
        <Doughnut data={data}/>
      );
}

export default DoughnutChart;