import React, { useState } from 'react';
import { Table } from '../../Utils/Table';
import { EurInput } from '../../Utils/Inputs';
import { NumberLabel } from '../../Utils/Labels';

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

    const foldersSum = {};
    function calculFoldersValuesSum(folder) {
        foldersSum[folder.id] = folder.products.reduce((sums, p) => {
            if (!p.visible) {
                return sums;
            }
            if (p.type === 'f') {
                calculFoldersValuesSum(p);
                return foldersSum[p.id].map((v,i) => v + sums[i]);
            } else if (p.hasValue) {
                return p.values.map((v,i) => v + sums[i])
            }
            return sums;
        }, dates.map(_ => 0));
    }
    calculFoldersValuesSum(wallet);

    // Set the Current Date Variable and related functions
    const [currentDate, setCurrentDate] = useState(new Date())
    const newDateValid = dates.findIndex(d => d == dateToString(currentDate)) === -1;
    function setToToday() {
        const newDate = new Date();
        setCurrentDate(newDate);
    }
    function updateDate(event) {
        const newDate = new Date(event.target.value);
        setCurrentDate(newDate);
    }
    function addDate() {
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

    function deleteDate(event) {
        const date = event.target.name;
        const dateIndex = dates.findIndex(d => d == date);
        dates.splice(dateIndex, 1);
        removeDateToProducts(wallet, dateIndex)
        updateData();
    }
    function onChangeDate(event) {
        const oldDate = event.target.name;
        const newDate = event.target.value;
        const oldDateIndex = dates.findIndex(d => d == oldDate);
        dates[oldDateIndex] = newDate;

        const dateIndexes = Array.from(dates.keys()).sort((a, b) => dates[a].localeCompare(dates[b]));
        const sortedDates = dateIndexes.map(i => dates[i]);
        for (let i in dates) {
            dates[i] = sortedDates[i];
        }
        updateDateToProducts(wallet, dateIndexes);
        updateData()
    }

    function initCols() {
        return [['Dates'], ...dates.map((d) => [
            <div key={`date-${d}`} className='flex align-center'>
                <button onClick={deleteDate} name={d}>-</button>
                <input type='date' className='item-date' defaultValue={d} name={d} onChange={onChangeDate} />
            </div>
        ])];
    }

    const tableContent = initCols();

    const prefixStyle = {
        width: '100%', height: '0.1rem',
        backgroundColor: 'grey', marginTop: '0.5rem', marginBottom: '0.4rem'
    }
    let prefixCount = 0;
    function getNewPrefix() {
        prefixCount++;
        return <div style={prefixStyle} key={prefixCount} />
    }
    function folderHasValue(folder) {
        for (let i in folder.products) {
            const p = folder.products[i]
            if (p.type === 'p' && p.hasValue) {
                return true;
            } else if (p.type === 'f') {
                if (folderHasValue(p)) {
                    return true;
                }
            }
        }
        return false;
    }
    function completeCols(product, prefixs = []) {
        if (product.visible) {
            if (product.type === 'f' && folderHasValue(product)) {
                function toggleOpen() {
                    product.isOpen = !product.isOpen;
                    updateData();
                }
                tableContent[0].push(
                    <div className='flexy full-size align-baseline'>
                        {prefixs}
                        <div className='clickable flex flex-nowrap full-size' onClick={toggleOpen}>
                            {product.name}{product.isOpen ? ' ▷\xa0' : ' ◁'}
                            {product.isOpen ? getNewPrefix() : ''}
                        </div>
                    </div>)
                dates.forEach((_, i) => tableContent[i + 1].push(
                    <div className='flex full-size align-center'>
                        {i !== 0 ? NumberLabel('', 100 * 
                            (foldersSum[product.id][i-1] ? foldersSum[product.id][i] / foldersSum[product.id][i-1] : 1) - 100, '%\xa0') : ''}
                        {<input style={{color: 'lightgray'}} className='text-right' disabled defaultValue={foldersSum[product.id][i]}/>}&nbsp;€
                    </div>
                ));
                if (product.isOpen) {
                    product.products.forEach(p => completeCols(p, [...prefixs, getNewPrefix()]));
                }
            } else if (product.hasValue) {
                tableContent[0].push(
                    <div className='flexy full-size align-baseline'>
                        {prefixs}
                        {product.name}
                    </div>); // title
                product.values.forEach((v, i) => {
                    function valueChanged(newValue) {
                        product.values[i] = newValue;
                        updateData();
                    }
                    tableContent[i + 1].push(
                        <div className='flex full-size align-center'>
                            {i !== 0 ? NumberLabel('', 100 *
                                (product.values[i - 1] ? v /product.values[i-1] : 1) - 100, '%') : ''}
                            {EurInput(v, valueChanged, `item-${product.id}-${i}`)}
                        </div>
                    );
                });
            }
        }
    }

    completeCols(wallet);

    return <div className='full-size flexy'>
        {newDateItems}
        {Table(tableContent)}
    </div>

}

export default EditValues;