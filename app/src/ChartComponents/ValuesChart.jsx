import {React, useState} from 'react';
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';

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
        filler: {
            propagate: false
        },
        tooltip: {
            callbacks: {
                footer: sumFooterToolip,
                title: dateTitleTooltip,
                label: labelTooltip,
            },
            itemSort: sortItem
        },
        legend: {
            onClick: () => { }
        }
    },
    maintainAspectRatio: false,
    animation: false
}


function formatData(data) {
    // Number of dates we have data of  
    const listSize = data.wallet.valuesDates.length;

    function getFolderValuesSums(folder) {
        let sum = [];
        for (let i = 0; i < listSize; i++) {
            sum.push(0);
        }
        folder.products.forEach(p => {
            if (p.visible) {
                if (p.type === 'f') {
                    getFolderValuesSums(p, listSize)[0].values.forEach((v, i) => sum[i] += v);
                } else if (p.hasValue) {
                    p.values.forEach((v, i) => {
                        sum[i] += v;
                    });
                }
            }
        })
        return [{
            name: folder.name,
            values: sum,
            color: folder.color
        }];
    }
    function getValues(product) {
        if (!product.visible) {
            return [];
        }
        if (product.type === 'f') {
            if (product.isOpen) {
                return product.products.reduce((res, p) => {res.push(...getValues(p)); return res;}, []);
            }
            return getFolderValuesSums(product);
        }
        else if (product.hasValue) {
            return [{
                name: product.name,
                values: product.values,
                color: product.color
            }];
        }
        return [];
    }

    // Filter the valueless products
    const items = getValues(data.wallet);
    // // sort the values of the latest data in DESC order
    items.sort((a, b) => b.values[listSize - 1] - a.values[listSize - 1]);

    // Build the data
    const chartData = {
        labels: data.wallet.valuesDates,
        datasets: items.map((item) => {
            return {
                data: item.values,
                label: item.name,
                borderColor: item.color,
                backgroundColor: item.color + '50',
                fill: '-1'
            }
        }),
    }
    // set the fill as true for the first one instead of -1
    if (chartData.datasets.length > 0) {
        chartData.datasets[0].fill = true;
    }
    return chartData;
}

function ValuesChart({ data }) {
    return (
        <div className='full-size chart'>
            <Line data={formatData(data)} options={options} />
        </div>
    );
}

export default ValuesChart;