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
function sumFooterToolip(tooltipItems) {
    const income = tooltipItems[0].parsed.y;
    const fees = tooltipItems[1].parsed.y;
    const diff = income + fees;
    return 'Diff: ' + numberToEur(diff);
}
function labelTooltip(tooltipItem){
    const label = tooltipItem.dataset.label;
    const val = tooltipItem.parsed.y;
    const eur = numberToEur(val);
    return `${label}: ${eur}`;
}

function getWeeklyIncome(income){
    const str = `${income.val}`;
    return !/^-?\d+$/.test(str) || income.everyDays === 0 ? 0 : income.val * 7 / income.everyDays;
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
                footer: sumFooterToolip,
                label: labelTooltip
            }
        },
        legend:{
            onClick: () => {}
        }
    },
    maintainAspectRatio: false
}
function formatData(_data) {
    const filteredIncome = _data.products.filter(item => item.visible && (item.income.val !== 0 || item.fees.val !== 0));
    const weeklyIncome = filteredIncome.map(item => {return {
        name: item.name,
        income: getWeeklyIncome(item.income),
        fees: - getWeeklyIncome(item.fees)
    }});
    weeklyIncome.sort((a,b) => b.income + b.fees - a.income - a.fees);
    
    const labels = weeklyIncome.map(item => item.name);
    const incomes = weeklyIncome.map(item => item.income);
    const fees = weeklyIncome.map(item => item.fees);
    let total = 0;
    const totalList = [];
    for (let i in incomes){
        total += incomes[i] + fees[i];
        totalList.push(total);
    }

    return {
        labels: labels,
        datasets: [{
            type: 'bar',
            data: incomes,
            label: 'incomes',
            borderWidth: 2,
            borderColor: '#30aa30',
            backgroundColor: '#304030',
            fill: true
        },{
            type: 'bar',
            data: fees,
            label: 'fees',
            borderWidth: 2,
            borderColor: '#aa3030',
            backgroundColor: '#403030',
            fill: true
        },{
            type: 'line',
            data: totalList,
            label: 'Total',
            borderColor: '#3030aa',
            backgroundColor: '#303040',
            fill: true
        }
    ]
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