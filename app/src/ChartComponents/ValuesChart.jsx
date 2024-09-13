import {React, useState} from 'react';
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Container } from 'reactstrap';

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

function addTitle(title){
    return {
        display: true,
        text: title
    }
}

function numberToEur(num){
    const eur = Math.round(num * 100) / 100.0;
    return eur + '€';
}
function dateTitleTooltip(tooltipItems) {
    const date = tooltipItems[0].label.split(', ')
    return date[0] + ' ' + date[1];
}
function labelTooltip(tooltipItem){
    const label = tooltipItem.dataset.label;
    const val = tooltipItem.parsed.y;
    if (val === 0){
        return '';
    }
    const eur = numberToEur(val);
    return `${label}: ${eur}`;
}
function sumFooterToolip(tooltipItems) {
    let sum = 0;
    tooltipItems.forEach(item => sum += item.parsed.y);
    return 'Sum: ' + numberToEur(sum);
}
function sortItem(a,b){
    return b.datasetIndex - a.datasetIndex;
}

const options = {
    scales: {
        x: {
            type: 'time',
            title: addTitle('Date'),
            time: {
                unit: 'day',
            }
        },
        y: {
            stacked: true,
            beginAtZero: true,
            title: addTitle('Value')
        },
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    responsive: true,
    plugins: {
        tooltip: {
            callbacks:{
                footer: sumFooterToolip,
                title: dateTitleTooltip,
                label: labelTooltip,
            },
            itemSort: sortItem
        },
        legend:{
            onClick: () => {}
        }
    },
    maintainAspectRatio: false
}

function formatData(_data) {
    // Number of dates we have data of  
    const listSize = _data.valuesDates.length;

    // Filter the valueless products
    const filteredProducts = _data.products.filter(item => item.visible && item.values.length !== 0);
    // sort the values of the latest data in DESC order
    filteredProducts.sort((a, b) => b.values[listSize - 1] - a.values[listSize - 1]);

    // Build the data
    const data = {
        labels: _data.valuesDates,
        datasets: filteredProducts.map((item) => {
            return {
                data: item.values,
                label: item.name,
                borderColor: '#30aa30',
                backgroundColor: '#304030',
                fill: true
            }
        }),
    }
    return data;
}

function ValuesChart(props) {
    return (
        <Container className='full-size chart'>
            <Line data={formatData(props.data)} options={options} />
        </Container>
    );
}

export default ValuesChart;