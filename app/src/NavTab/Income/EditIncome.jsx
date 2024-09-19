import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput, NaturalInput } from '../../Utils/Inputs';

function getMonthlyIncome(income){
    return income.days === 0 ? 0 : income.value * 30 / income.days;
}
function EditIncome({ data, updateData }) {

    const foldersSum = {};

    function calculFoldersIncomesSum(folder){
            foldersSum[folder.id] = folder.products.reduce((sum, p) => {
                if (!p.visible){
                    return sum;
                }
                if (p.type === 'f'){
                    calculFoldersIncomesSum(p);
                    return sum + foldersSum[p.id];
                } else if (p.hasIncome){
                    return sum + p.incomes.reduce((sum, i) => sum + getMonthlyIncome(i), 0);
                }
                return sum;
            }, 0)
    }

    calculFoldersIncomesSum(data.wallet);

    function getFolderRow(folder, prefix) {
        function toggleOpen(){
            folder.isOpen = !folder.isOpen;
            updateData();
        }
        return [
            <div key={folder.id} className='clickable flex justify-space-between flex-nowrap align-center'
            onClick={toggleOpen}>
                {prefix}{folder.isOpen ? '▽ ' : '▷ '}{folder.name}
            </div>,
            '', <div>{foldersSum[folder.id]}</div>,
        ];
    }
    
    function getIncomeRows(product, prefix) {
        return product.incomes.map(i => {
            function changeValue(value) {
                i.value = value;
                updateData();
            }
            function changeDays(newValue) {
                i.days = parseFloat(newValue);
                updateData();
            }
            function deleteIncome() {
                product.incomes = product.incomes.filter(_i => _i.name !== i.name);
                updateData();
            }
            return [
                <div className='flex justify-space-between flex-nowrap align-center'
                    key={`${product.name}-${i.name}`}>
                    {prefix}{i.name}&nbsp;
                    <button className='flex-right' onClick={deleteIncome}>-</button>
                </div>,
                EurInput(i.value, changeValue),
                NaturalInput(i.days, changeDays)
            ];
        });
    }

    function getProductRow(product, prefix) {

        const [showIncomes, setShowIncomes] = useState(false);

        const sum = product.incomes.reduce((s, i) => i.days !== 0 ? s + i.value * 30 / i.days : 0, 0);

        const [newIncomeValid, setNewIncomeValid] = useState(false)
        function isNewIncomeValid(event) {
            const newIncome = event.target.value;
            setNewIncomeValid(newIncome != '' && product.incomes.findIndex(i => i.name == newIncome) === -1);
        }
        function newIncome() {
            const input = document.getElementById('new-income-input-' + product.id);
            product.incomes.push({
                name: input.value,
                days: 30,
                value: 1,
            });
            input.value = ''
            setNewIncomeValid(false);
            setShowIncomes(true);
            updateData();
        }

        const key = `new-income-input-${product.id}`
        const productRow = [
            <div onClick={() => setShowIncomes(!showIncomes)} className='clickable flex flex-nowrap'>
                {prefix}{showIncomes ? '▽' : '▷'} {product.name}
            </div>,
            <div className='flex flex-nowrap align-center'>
                <input placeholder='New Income' id={key} onChange={isNewIncomeValid} defaultValue='' key={key} />
                <button onClick={newIncome} disabled={!newIncomeValid}>+</button>
            </div>,
            <div className='flex justify-space-between flex-nowrap align-center'>
                <div>Total: </div><div>{sum}€ /mo</div>
            </div>];

        if (!showIncomes) {
            return [productRow];
        }

        const incomeRows = getIncomeRows(product, '\xa0| ' + prefix);
        return [productRow, ...incomeRows];
    }

    function getRows(product, prefix='') {
        if (!product.visible) {
            return [];
        }
        if (product.type === 'f') {
            const folderRow = getFolderRow(product, prefix);
            const productRows = product.products.reduce((res, p) => { res.push(...getRows(p, prefix + '\xa0| ')); return res }, [])
            if (product.isOpen) {
                return [folderRow, ...productRows];
            } else {
                return [folderRow];
            }
        } else if (product.hasIncome) {
            return getProductRow(product, prefix);
        }
        return [];
    }

    const header = ['Product', 'Income', 'Every x Days'];

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