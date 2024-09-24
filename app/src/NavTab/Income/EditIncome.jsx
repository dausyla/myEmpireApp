import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput, NaturalInput } from '../../Utils/Inputs';
import { NumberLabel } from '../../Utils/Labels';
import { IncomeRows } from './IncomeRows';


export function getMonthlyIncome(product, income) {
    const pt = income.periodType;
    const p = income.period;
    const monthPeriod = 365 / 12;
    const month = p * (
        pt === 'day' ? 1 / monthPeriod:
        pt === 'week' ? 7 / monthPeriod:
        pt === 'month' ? 1 :
        365 / monthPeriod
    )
    const val = income.type === 'pct' ? product.values[product.values.length -1] * income.value / 100 : income.value;
    return month === 0 ? 0 : val / month;
}

function getProductNames(product){
    if (product.type === 'f'){
        return product.products.reduce((total, p) => {total.push(...getProductNames(p)); return total}, []);
    } else {
        return [{
            name: product.name,
            id: product.id
        }]
    }
}

function EditIncome({ data, updateData }) {

    const productNames = getProductNames(data.wallet);
    const foldersSum = {};

    const prefixStyle = {
        height: '100%', width: '0.1rem',
        backgroundColor: 'grey', marginLeft: '0.35rem', marginRight: '0.45rem'
    }
    let prefixCount = 0;
    function getNewPrefix() {
        prefixCount++;
        return <div style={prefixStyle} key={prefixCount} />
    }

    function calculFoldersIncomesSum(folder) {
        foldersSum[folder.id] = folder.products.reduce((sum, p) => {
            if (!p.visible) {
                return sum;
            }
            if (p.type === 'f') {
                calculFoldersIncomesSum(p);
                return sum + foldersSum[p.id];
            } else if (p.hasIncome) {
                return sum + p.incomes.reduce((sum, i) => sum + getMonthlyIncome(p, i), 0);
            }
            return sum;
        }, 0)
    }

    calculFoldersIncomesSum(data.wallet);

    function getFolderRow(folder, prefixs) {
        function toggleOpen() {
            folder.isOpen = !folder.isOpen;
            updateData();
        }
        const res = [
            <div className='flex flex-nowrap align-center full-size' key={folder.id + '-group'}>
                <div className='flex align-self-stretch'>{prefixs}</div>
                <div className='clickable' onClick={toggleOpen} key={folder.id + 'name'}>
                    {folder.isOpen ? '▽ ' : '▷ '}{folder.name}
                </div>
                {NumberLabel(`\xa0`, foldersSum[folder.id], '€ /mo')}
            </div>,
            '','',''
        ];
        return res;
    }

    function getIncomeRows(product, prefixs) {
        return IncomeRows(prefixs, product, productNames, updateData)
    }

    function getProductRow(product, prefixs) {

        const [showIncomes, setShowIncomes] = useState(false);

        const sum = product.incomes.reduce((s, i) => s + getMonthlyIncome(product, i), 0);

        const [newIncomeValid, setNewIncomeValid] = useState(false)
        function isNewIncomeValid(event) {
            const newIncome = event.target.value;
            setNewIncomeValid(newIncome != '' && product.incomes.findIndex(i => i.name == newIncome) === -1);
        }
        function newIncome() {
            const input = document.getElementById('new-income-input-' + product.id);
            product.incomes.push({
                name: input.value,
                value: 1,
                type: 'euro',
                period: 1,
                periodType: 'month',
                into: -1,
            });
            input.value = ''
            setNewIncomeValid(false);
            setShowIncomes(true);
            updateData();
        }

        const key = `new-income-input-${product.id}`
        const productRow = [
            <div onClick={() => setShowIncomes(!showIncomes)} className='flex flex-nowrap full-size' key={product.id + '-name'}>
                <div className='align-self-stretch flex'>{prefixs}</div>
                <div className='flex clickable align-center'>
                    {showIncomes ? '▽' : '▷'} {product.name}
                </div>
                {NumberLabel('\xa0', sum, '€ /mo')}
            </div>,
            <div className='flex flex-nowrap align-center' key={product.name + '-new'}>
                <input placeholder='New Income' id={key} onChange={isNewIncomeValid} defaultValue='' key={key} />
                <button onClick={newIncome} disabled={!newIncomeValid}>+</button>
            </div>,
            '',
            ''
            ];

        if (!showIncomes) {
            return [productRow];
        }

        const incomeRows = getIncomeRows(product, [...prefixs, getNewPrefix()]);
        return [productRow, ...incomeRows];
    }

    function folderHasIncome(folder) {
        for (let i in folder.products) {
            const p = folder.products[i]
            if (p.type === 'p' && p.hasIncome) {
                return true;
            } else if (p.type === 'f') {
                if (folderHasIncome(p)) {
                    return true;
                }
            }
        }
        return false;
    }

    function getRows(product, prefixs = []) {
        if (!product.visible) {
            return [];
        }
        if (product.type === 'f' && folderHasIncome(product)) {
            const folderRow = getFolderRow(product, prefixs);
            const productRows = product.products.reduce((res, p) => { res.push(...getRows(p, [...prefixs, getNewPrefix()])); return res }, [])
            if (product.isOpen) {
                return [folderRow, ...productRows];
            } else {
                return [folderRow];
            }
        } else if (product.hasIncome) {
            return getProductRow(product, prefixs);
        }
        return [];
    }

    const header = ['Product', 'Income', 'Every', 'Into'];

    const incomeRows = getRows(data.wallet);

    const tableContent = [
        header,
        ...incomeRows
    ];

    return <div className='flexy full-size'>
        {Table(tableContent, { topClass: 'text-left', leftClass: 'text-left' })}
    </div>
}

export default EditIncome;