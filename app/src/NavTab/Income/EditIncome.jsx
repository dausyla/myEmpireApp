import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput, NaturalInput } from '../../Utils/Inputs';

function getMonthlyIncome(income){
    return income.days === 0 ? 0 : income.value * 30 / income.days;
}
function EditIncome({ data, updateData }) {

    const foldersSum = {};

    const prefixStyle = {height: '100%', width: '0.1rem',
        backgroundColor: 'grey', marginLeft: '0.35rem', marginRight: '0.45rem'}
    let prefixCount=0;
    function getNewPrefix(){
        prefixCount++;
        return <div style={prefixStyle} key={prefixCount}/>
    }

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

    function getFolderRow(folder, prefixs) {
        function toggleOpen(){
            folder.isOpen = !folder.isOpen;
            updateData();
        }
        const res = [
            <div className='flex flex-nowrap align-center full-size' key={folder.id + '-group'}>
                <div className='flex align-self-stretch'>{prefixs}</div>
                <div className='clickable' onClick={toggleOpen} key={folder.id + 'name'}>
                    {folder.isOpen ? '▽ ' : '▷ '}{folder.name}
                </div>
            </div>,
            <div key={folder.id + '-empty'}></div>, <div key={folder.id + '-sum'}>{foldersSum[folder.id]}</div>,
        ];
        return res;
    }
    
    function getIncomeRows(product, prefixs) {
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
                <div className='flex flex-nowrap align-center full-size'
                    key={`${product.name}-${i.name}`}>
                    <div className=' flex align-self-stretch'>{prefixs}</div>{i.name}&nbsp;
                    <button className='' onClick={deleteIncome}>-</button>
                </div>,
                EurInput(i.value, changeValue, i.name + '-value'),
                NaturalInput(i.days, changeDays, i.name + '-days')
            ];
        });
    }

    function getProductRow(product, prefixs) {

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
            <div onClick={() => setShowIncomes(!showIncomes)} className='flex flex-nowrap full-size' key={product.id + '-name'}>
                <div className='align-self-stretch flex'>{prefixs}</div>
                <div className='flex clickable align-center'>
                {showIncomes ? '▽' : '▷'} {product.name}
                </div>
            </div>,
            <div className='flex flex-nowrap align-center' key={product.name + '-new'}>
                <input placeholder='New Income' id={key} onChange={isNewIncomeValid} defaultValue='' key={key} />
                <button onClick={newIncome} disabled={!newIncomeValid}>+</button>
            </div>,
            <div className='flex justify-space-between flex-nowrap align-center' key={product.name + '-total'}>
                <div>Total: </div><div>{sum}€ /mo</div>
            </div>];

        if (!showIncomes) {
            return [productRow];
        }

        const incomeRows = getIncomeRows(product, [...prefixs, getNewPrefix()]);
        return [productRow, ...incomeRows];
    }

    function getRows(product, prefixs=[]) {
        if (!product.visible) {
            return [];
        }
        if (product.type === 'f') {
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