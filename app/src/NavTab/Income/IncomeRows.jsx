import React from "react";
import { EurInput, NaturalInput } from "../../Utils/Inputs";

export function IncomeRows(prefixs, product, products, updateData) {
    return product.incomes.map(i => {
        function changeValue(value) {
            i.value = value;
            updateData();
        }
        function changePeriod(newValue) {
            i.period = parseFloat(newValue);
            updateData();
        }
        function deleteIncome() {
            product.incomes = product.incomes.filter(_i => _i.name !== i.name);
            updateData();
        }
        function onIncomeTypeChange(e){
            i.type = e.target.value;
            updateData();
        }
        function onPeriodTypeChange(e){
            i.periodType = e.target.value;
            updateData();
        }
        function onGoingInChange(e){
            i.goingIn = e.target.value;
            updateData();
        }
        return [
            <div className='flex flex-nowrap align-center full-size'
                key={`${product.name}-${i.name}`}>
                <div className=' flex align-self-stretch'>{prefixs}</div>{i.name}&nbsp;
                <button className='' onClick={deleteIncome}>-</button>
            </div>,
            <div className="flex flex-nowrap">
                {EurInput(i.value, changeValue, i.name + '-value', '')}
                <select onChange={onIncomeTypeChange} defaultValue={i.type}>
                    <option value='eur'>€</option>
                    {product.hasValue ? <option value='pct'>%</option> : ''}
                </select>
            </div>,
            <div className="flex flex-nowrap">
                {NaturalInput(i.period, changePeriod, i.name + '-days')}
                <select onChange={onPeriodTypeChange} defaultValue={i.periodType}>
                    <option value='day'>day</option>
                    <option value='week'>week</option>
                    <option value='month'>month</option>
                    <option value='year'>year</option>
                </select>
            </div>,
            <div className="flex flex-nowrap">
                <select onChange={onGoingInChange} defaultValue={i.goingIn}>
                    <option value={-1}>None</option>
                    {products.map(p => <option value={p.id} key={p.id + '-' + i.name}>{p.name}</option>)}
                </select>
            </div>
        ];
    });
}