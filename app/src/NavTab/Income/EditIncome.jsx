import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput } from '../../Utils/Inputs';

function getProductRow(product, updateData){
    const [showIncomes, setShowIncomes] = useState(false);

    const sum = product.incomes.reduce((s, i) => i.days !== 0 ? s + i.value * 30 / i.days : 0, 0);

    function newIncome(){
        const input = document.getElementById('new-income-input-' + product.name);
        product.incomes.push({
            name: input.value,
            days: 30,
            value: 1,
        });
        input.value = ''
        setShowIncomes(true);
        updateData();
    }
    const [newIncomeValid, setNewIncomeValid] = useState(false)
    function isNewIncomeValid(event){
        const newIncome = event.target.value;
        setNewIncomeValid(newIncome != '' && product.incomes.findIndex(i => i.name == newIncome) === -1);
    }


    const key = `new-income-input-${product.name}`
    const res = [[
        <div onClick={() => setShowIncomes(!showIncomes)} className='clickable'>
            {showIncomes ? '▽' : '▷'}{product.name}
        </div>,
        <div>
            <input placeholder='New Income' id={key} onChange={isNewIncomeValid} defaultValue='' key={key}/>
            <button onClick={newIncome} disabled={!newIncomeValid}>+</button>
        </div>, sum]];

    if (!showIncomes){
        return res;
    }

    product.incomes.forEach(i => {
        function changeValue(value){
            i.value = value;
            updateData();
        }
        function changeDays(event){
            i.days = parseFloat(event.target.value);
            updateData();
        }
        function deleteIncome(){
            const incomeIndex = product.incomes.findIndex(_i => _i.name == i.name);
            product.incomes.splice(incomeIndex, 1);
            updateData();
        }
        res.push([
            <div className='flex justify-space-between'>
                &nbsp;| {i.name}
                <button className='flex-right' onClick={deleteIncome}>-</button>
            </div>,
            EurInput(i.value, changeValue),
            <input defaultValue={i.days} onChange={changeDays} />])
    });

    return res;
}


function EditIncome(props) {
    const products = props.data.products;

    const filteredProducts = products.filter(p => p.hasIncome);

    const header = ['', 'Income', 'Every x Days'];

    const incomeRows = [];
    filteredProducts.forEach(p => getProductRow(p, props.updateData).forEach(r => incomeRows.push(r)))

    const tableContent = [
        header,
        ...incomeRows
    ];

    return <div className='flexy full-size'>
        {Table(tableContent, { topClass: 'text-left', leftClass: 'text-left' })}
    </div>
}

export default EditIncome;