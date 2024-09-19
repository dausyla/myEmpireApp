import {React, useState} from 'react';
import { Chart as MixedChart } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

function numberToEur(num){
    const eur = Math.round(num * 100) / 100.0;
    return eur + '€';
}
function addSumMonthlyIncome(products) {
    products.forEach(p => {
        let sum = 0;
        p.incomes.forEach(i => sum += i.value);
        p.sum = sum;
    })
}
function labelTooltip(tooltipItem){
    const label = tooltipItem.dataset.label;
    const val = tooltipItem.parsed.y;
    const eur = numberToEur(val);
    return `${label}: ${eur}`;
}

function getMonthlyIncome(income){
    const str = `${income.value}`;
    return income.days === 0 ? 0 : income.value * 30 / income.days;
}
function getFolderIncomesSum(folder){
    let pos = 0;
    let neg = 0;
    folder.products.forEach(p => {
        if (p.visible) {
            if (p.type === 'f') {
                let tmp = getFolderIncomesSum(p);
                pos += tmp.incomes[0].value;
                neg += tmp.incomes[1].value;
            } else if (p.hasIncome) {
                pos += p.incomes.reduce((sum, i) => {
                    const monthly = getMonthlyIncome(i);
                    return monthly > 0 ? monthly : 0;
                }, 0);
                neg += p.incomes.reduce((sum, i) => {
                    const monthly = getMonthlyIncome(i);
                    return monthly < 0 ? monthly : 0;
                }, 0);
            }
        }
    })
    console.log(`pos: ${pos}, neg: ${neg}`)
    return {
        name: folder.name,
        incomes: [
            {
                name: 'Positive Incomes',
                value: pos,
            },
            {
                name: 'Negative Incomes',
                value: neg,
            },
        ]
    }
}
function getFoldersAndProductsIncomes(products) {
    const res = [];
    products.forEach(p => {
        if (p.visible) {
            if (p.type === 'f') {
                if (p.isOpen) {
                    res.push(...getFoldersAndProductsIncomes(p.products))
                }
                else {
                    res.push(getFolderIncomesSum(p))
                }
            }
            else if (p.hasIncome) {
                res.push({ name: p.name, incomes: p.incomes.map(i => {return {name: i.name, value: getMonthlyIncome(i)}})})
            }
        }
    })
    return res;
}

const options = {
    scales: {
        x: {
            stacked: true,
        },
        y: {
            beginAtZero: true,
            stacked: true
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
            callbacks: {
                label: labelTooltip
            }
        },
        legend: {
            onClick: () => { } // Make legend fixed
        }
    },
    maintainAspectRatio: false,
    animation: false
}
function formatData(data) {
    const items = getFoldersAndProductsIncomes(data.products);
    const filteredProducts = data.products.filter(item => item.visible && item.hasIncome && (item.incomes.length > 0));
    const monthlyIncomesProducts = filteredProducts.map(p => {

        return {
            name: p.name,
            incomes: p.incomes.map(i => {
                return {
                    name: i.name,
                    value: getMonthlyIncome(i)
                }
            }),
        }
    });
    addSumMonthlyIncome(items); // Add the sum to the product

    // monthlyIncomesProducts.sort((a, b) => b.sum - a.sum);
    items.sort((a, b) => b.sum - a.sum);

    // const labels = monthlyIncomesProducts.map(p => p.name);
    // const sums = monthlyIncomesProducts.map(p => p.sum);
    const labels = items.map(item => item.name);
    const sums = items.map(item => item.sum);

    const datasets = [{
        type: 'line',
        data: sums,
        label: 'Sum',
        borderWidth: 2,
        borderColor: '#3030aa',
        backgroundColor: '#3030aa50',
    }];

    items.forEach(item => {
        item.incomes.forEach(i => {
            datasets.push({
                type: 'bar',
                data: [{ x: item.name, y: i.value }],
                label: i.name,
                borderWidth: 2,
                borderColor: i.value > 0 ? '#30aa30' : '#aa3030',
                backgroundColor: i.value > 0 ? '#30aa3050' : '#aa303050',
                fill: true,
            })
        })
    });

    return {
        labels: labels,
        datasets: datasets
    }
}

function IncomeChart(props) {
    return (
        <div className='full-size chart'>
            <MixedChart data={formatData(props.data)} options={options} />
        </div>
    );
}

export default IncomeChart;