import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput } from '../../Utils/Inputs';

function dateToString(date){
    return date.toISOString().split('T')[0];
}

function EditValues(props) {
    // Get some variables (cleaner)
    const products = props.data.products;
    const filteredProducts = products.filter(p => p.hasValue);
    const dates = props.data.valuesDates;

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
        if (dates.length > 1){
            // take the previous value unless it's 0 => take the next one
            const indexToTake = dateIndex > 0 ? dateIndex - 1 : 0;
            products.forEach(p => {p.values.splice(dateIndex, 0, p.values[indexToTake]);});
        }
        else{
            products.forEach(p => { 
                p.values = [Math.floor(Math.random() * 500 + 500)]; // set a random value between 500 and 1000
            });
        }
        props.updateData();
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
        products.forEach(p => p.values.splice(dateIndex, 1));
        props.updateData();
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
        products.forEach(p => {p.values = dateIndexes.map(i => p.values[i])});
        props.updateData()
    }

    const tableContent = [['Dates', ...filteredProducts.map(p => p.name)]];
    dates.forEach((d, i) => {
        tableContent.push([
            <div key={`value-row-${d}`} className='flex align-center'>
                <button onClick={deleteDate} name={d}>-</button>
                <input type='date' className='item-date' defaultValue={d} name={d} onChange={onChangeDate} />
            </div>,
            ...filteredProducts.map(p => {
                function valueChanged(newValue) {
                    p.values[i] = newValue;
                    props.updateData();
                }
                return EurInput(p.values[i], valueChanged, `item-${p.name}-${d}`)
            })
        ])
    });

    return <div className='full-size flexy'>
        {newDateItems}
        {Table(tableContent)}
    </div>

}

export default EditValues;