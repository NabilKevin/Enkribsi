/* eslint-disable react/prop-types */
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PieChart = ({statistics}) => {
  useEffect(() => {
    import('@/css/chart/index.css')
  }, [])
  const labels = ['Hadir', 'Izin', 'Telat', 'Alfa']
  const data = {
    labels,
    datasets: [
        {
            label: 'Kehadiran',
            data: [...labels].map((_, i) => statistics[`${labels[i].toLowerCase()}`]),
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }
    ]
  };
  return <Bar data={data} className='barchart' />;
}

export default PieChart;