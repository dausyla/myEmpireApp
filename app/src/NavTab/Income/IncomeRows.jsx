import React from "react";
import { EurInput, NaturalInput } from "../../Utils/Inputs";
import { Select } from "../../Utils/Select";

export function IncomeRows(prefixs, product, valuableProducts, updateData) {
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
        function onIntoChange(e){
            i.into = e.target.value;
            updateData();
        }
        const periodTypes = [
            {name: 'day', id: 'day'},
            {name: 'week', id: 'week'},
            {name: 'month', id: 'month'},
            {name: 'year', id: 'year'}
        ]
        const valueTypes = [
            {name: '€', id:'eur'},
        ]
        if (product.hasValue){
            valueTypes.push({name: '%', id: 'pct'})
        }
        return [
            <div className='flex flex-nowrap align-center full-size'
                key={`${product.name}-${i.name}`}>
                <div className=' flex align-self-stretch'>{prefixs}</div>{i.name}&nbsp;
                <button className='' onClick={deleteIncome}>-</button>
            </div>,
            <div className="flex flex-nowrap">
                {EurInput(i.value, changeValue, i.name + '-value', '')}
                {Select(onIncomeTypeChange, valueTypes, i.type)}
            </div>,
            <div className="flex flex-nowrap">
                {NaturalInput(i.period, changePeriod, i.name + '-days')}
                {Select(onPeriodTypeChange, periodTypes, i.periodType)}
            </div>,
            <div className="flex flex-nowrap">
                {Select(onIntoChange, valuableProducts, i.into)}
            </div>
        ];
    });
}