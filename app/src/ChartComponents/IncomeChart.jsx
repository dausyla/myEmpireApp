import {React, useState} from 'react';
import { Chart as MixedChart } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';

import { Container } from 'reactstrap';

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

const options = {
    scales: {
        x: {
            stacked: true,
        },
        y: {
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
            callbacks:{
                label: labelTooltip
            }
        },
        legend:{
            onClick: () => {} // Make legend fixed
        }
    },
    maintainAspectRatio: false
}
function formatData(data) {
    const filteredProducts = data.products.filter(item => item.visible && (item.incomes.length > 0));
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
    addSumMonthlyIncome(monthlyIncomesProducts); // Add the sum to the product

    monthlyIncomesProducts.sort((a, b) => b.sum - a.sum);

    const labels = monthlyIncomesProducts.map(p => p.name);
    const sums = monthlyIncomesProducts.map(p => p.sum);

    const datasets = [{
        type: 'line',
        data: sums,
        label: 'Sum',
                borderWidth: 2,
                borderColor: '#3030aa',
                backgroundColor: '#3030aa50',
    }];

    monthlyIncomesProducts.forEach(p => {
        p.incomes.forEach(i => {
            datasets.push({
                    type: 'bar',
                    data: [{x: p.name, y: i.value}],
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
        <Container className='full-size chart'>
            <MixedChart data={formatData(props.data)} options={options} />
        </Container>
    );
}

export default IncomeChart;