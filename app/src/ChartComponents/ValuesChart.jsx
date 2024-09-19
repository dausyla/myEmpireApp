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
function getFolderValuesSums(folder, nbDates){
    let sum = [];
    for (let i = 0; i < nbDates; i++){
        sum.push(0);
    }
    folder.products.forEach(p => {
        if (p.visible) {
            if (p.type === 'f') {
                getFolderValuesSums(p, nbDates).forEach((v, i) => sum[i] += v);
            } else if (p.hasValue) {
                p.values.forEach((v, i) => {
                    console.log(`sum: ${sum}, i: ${i}, v: ${v}`)
                    sum[i] += v;
                });
            }
        }
    })
    return sum;
}
function getFoldersAndProductsValues(products, nbDates) {
    const res = [];
    products.forEach(p => {
        if (p.visible) {
            if (p.type === 'f') {
                if (p.isOpen) {
                    res.push(...getFoldersAndProductsValues(p.products, nbDates))
                }
                else {
                    res.push({
                        name: p.name,
                        values: getFolderValuesSums(p, nbDates),
                        color: p.color
                    })
                }
            }
            else if (p.hasValue) {
                res.push({ name: p.name, values: p.values, color: p.color })
            }
        }
    })
    return res;
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


function formatData(_data) {
    // Number of dates we have data of  
    const listSize = _data.valuesDates.length;

    // Filter the valueless products
    const items = getFoldersAndProductsValues(_data.products, listSize);
    console.log(items);
    // const filteredProducts = _data.products.filter(item => item.visible && item.hasValue && item.values.length !== 0);
    // // sort the values of the latest data in DESC order
    // filteredProducts.sort((a, b) => b.values[listSize - 1] - a.values[listSize - 1]);
    items.sort((a, b) => b.values[listSize - 1] - a.values[listSize - 1]);

    // Build the data
    const data = {
        labels: _data.valuesDates,
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
    if (data.datasets.length > 0) {
        data.datasets[0].fill = true;
    }
    return data;
}

function ValuesChart(props) {
    return (
        <div className='full-size chart'>
            <Line data={formatData(props.data)} options={options} />
        </div>
    );
}

export default ValuesChart;