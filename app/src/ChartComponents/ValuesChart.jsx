import {React, useState} from 'react';
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fakeData } from '../Data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
    scales: {
        x: {
            type: 'time',
        },
        y: {
            stacked: true,
            beginAtZero: true
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    responsive: true,
    plugins: {
        tooltip: {
        }
    },
    maintainAspectRatio: false
}

function formatData(_data) {
    // Number of dates we have data of  
    const listSize = _data.valuesDates.length;

    // sort the values of the latest data in ASC order
    _data.products.sort((a,b) => b.values[listSize - 1] - a.values[listSize - 1]);
    // Filter the valueless products
    const filteredProducts = _data.products.filter(item => item.values.length !== 0);

    // Build the data
    const data = {
        labels: _data.valuesDates,
        datasets: filteredProducts.map((item) => {return {
            data: item.values,
            label: item.name,
            borderColor: '#30aa30',
            backgroundColor: '#304030',
            fill: true
        }}),
    }
    const [finalData, setFinalData] = useState(data);
    return finalData
}

function ValuesChart() {
    const data = formatData(fakeData);
    return (
        <div className="container">
            <Line data={data} options={options} />
        </div>
    );
}

export default ValuesChart;