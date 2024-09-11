import {React, useState} from 'react';
import { Line } from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'
import { fakeData } from './Data';

function formatData(_data) {
    const cfg = {
        datasets: [{
            data: [{ x: '2016-12-25', y: 20 }, { x: '2016-12-26', y: 10 }]
        }]
    }
    const [finalData, setFinalData] = useState(cfg);

    console.log(finalData);
    return finalData
}

function Chart() {
    const data = formatData(fakeData);

    return (
        <div class="container">
            <Line data={data} />
        </div>
    );
}

export default Chart;