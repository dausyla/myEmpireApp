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
        }
    },
    maintainAspectRatio: false
}

function formatData(_data) {
    const filteredIncome = _data.products.filter(item => item.visible && (item.income.val !== 0 || item.fees.val !== 0));
    const weeklyIncome = filteredIncome.map(item => {return {
        name: item.name,
        income: item.income.everyDays !== 0 ? item.income.val * 7 / item.income.everyDays : 0,
        fees: item.fees.everyDays !== 0 ? -item.fees.val * 7 / item.fees.everyDays : 0,
    }});
    weeklyIncome.sort((a,b) => b.income + b.fees - a.income - a.fees);
    
    const labels = weeklyIncome.map(item => item.name);
    const incomes = weeklyIncome.map(item => item.income);
    const fees = weeklyIncome.map(item => item.fees);
    let sum = 0;
    const sumList = [];
    for (let i in incomes){
        sum += incomes[i] + fees[i];
        sumList.push(sum);
    }

    const data = {
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
            data: sumList,
            label: 'Sum',
            borderColor: '#3030aa',
            backgroundColor: '#303040',
            fill: true
        }
    ]
    }

    return data;
}

function IncomeChart(props) {
    return (
        <div className="container">
            <MixedChart data={formatData(props.data)} options={options} />
        </div>
    );
}

export default IncomeChart;