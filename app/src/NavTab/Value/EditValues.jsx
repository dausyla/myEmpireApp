import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput } from '../../Utils/Inputs';

function dateToString(date){
    return date.toISOString().split('T')[0];
}

function updateDateToProducts(product, dateIndexes){
    if (product.type === 'f'){
        product.products.forEach(p => removeDateToProducts(p));
    } else {
        // even if not visible and/or has no values 
        product.values = dateIndexes.map(i => product.values[i]);
    }
}
function removeDateToProducts(product, dateIndex){
    if (product.type === 'f'){
        product.products.forEach(p => removeDateToProducts(p));
    } else {
        // even if not visible and/or has no values 
        product.values.splice(dateIndex, 1);
    }
}
function addDateToProducts(product, dateIndex){
    if (product.type === 'f'){
        product.products.forEach(p => addDateToProducts(p));
    } else {
        // even if not visible and/or has no values 
        if (product.values.length === 0){
            product.values = [0];
        } else {
            product.values.splice(dateIndex, 0, product.values[dateIndex > 0 ? dateIndex - 1 : 0]);
        }
    }
}

function EditValues({data, updateData}) {
    const wallet = data.wallet
    const dates = wallet.valuesDates;
    // Get some variables (cleaner)
    // const products = props.data.products;
    // const filteredProducts = products.filter(p => p.hasValue);

    // Set the Current Date Variable and related functions
    const [currentDate, setCurrentDate] = useState(new Date())
    const newDateValid = dates.findIndex(d => d == dateToString(currentDate)) === -1;
    function setToToday(){
        const newDate = new Date();
        setCurrentDate(newDate);
    }
    function updateDate(event){
        const newDate = new Date(event.target.value);
        setCurrentDate(newDate);
    }
    function addDate(){
        const date = dateToString(currentDate);
        let dateIndex = dates.findIndex(d => d > date)
        dateIndex = dateIndex === -1 ? dates.length : dateIndex;
        dates.splice(dateIndex, 0, date);
        addDateToProducts(wallet, dateIndex);
        updateData();
    }
    const newDateItems = <div className='flex'>
        <button onClick={addDate} disabled={!newDateValid}>Add</button>
            <input className='input-date' id="date" name="date" value={dateToString(currentDate)} type="date" onChange={updateDate} />
        <button onClick={setToToday}>Today</button>
    </div>

    function deleteDate(event){
        const date = event.target.name;
        const dateIndex = dates.findIndex(d => d == date);
        dates.splice(dateIndex, 1);
        removeDateToProducts(wallet, dateIndex)
        updateData();
    }
    function onChangeDate(event){
        const oldDate = event.target.name;
        const newDate = event.target.value;
        const oldDateIndex = dates.findIndex(d => d == oldDate);
        dates[oldDateIndex] = newDate;

        const dateIndexes = Array.from(dates.keys()).sort((a,b) => dates[a].localeCompare(dates[b]));
        const sortedDates = dateIndexes.map(i => dates[i]);
        for (let i in dates){
            dates[i] = sortedDates[i];
        }
        updateDateToProducts(wallet, dateIndexes);
        updateData()
    }
    
    function initCols(){
        return [['Dates'], ...dates.map((d) => [
            <div key={`date-${d}`} className='flex align-center'>
                <button onClick={deleteDate} name={d}>-</button>
                <input type='date' className='item-date' defaultValue={d} name={d} onChange={onChangeDate} />
            </div>
        ])];
    }

    // const tableContent = [['Dates', ...filteredProducts.map(p => p.name)]];
    const tableContent = initCols();
    // dates.forEach((d, i) => {
    //     tableContent.push([
    //         <div key={`value-row-${d}`} className='flex align-center'>
    //             <button onClick={deleteDate} name={d}>-</button>
    //             <input type='date' className='item-date' defaultValue={d} name={d} onChange={onChangeDate} />
    //         </div>,
    //         ...filteredProducts.map(p => {
    //             function valueChanged(newValue) {
    //                 p.values[i] = newValue;
    //                 props.updateData();
    //             }
    //             return EurInput(p.values[i], valueChanged, `item-${p.name}-${d}`)
    //         })
    //     ])
    // });

    return <div className='full-size flexy'>
        {newDateItems}
        {Table(tableContent)}
    </div>

}

export default EditValues;