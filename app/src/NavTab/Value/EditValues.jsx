import React, { useState } from 'react';

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
    const dateItems = <div className='flex flex-wrap'>
            <button disabled={!newDateValid} onClick={addDate}>Add</button>
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
    const dateColumn = <div>
        <div>&nbsp;</div>
        {dates.map(d => <div className='med-grey-hover' key={d}>
            <div className='flex'>
                <button onClick={deleteDate} name={d}>-</button>
                <input className='input-date' defaultValue={d} name={d} type='date' onChange={onChangeDate}/>
            </div>
        </div>)}
    </div>

    function onValueChange(event){
        const name = event.target.getAttribute('data-product-name');
        const index = parseInt(event.target.getAttribute('data-value-index'));
        const product = products.find(p => p.name == name);
        product.values[index] = event.target.value;
        props.updateData();
    }

    const productsColumn = <div className='flex not-centered'>
        {
            filteredProducts.map(p => (
                <div id={`product-col-${p.name}`} key={p.name}>
                    <div><p className='item-name'>{p.name}</p></div>
                    {p.values.map((v, i) => (
                        <div className='flex' key={p.name + i}>
                            <div className='flex'>
                                <input defaultValue={v} data-product-name={p.name} data-value-index={i} className='on-right input-min-width' onChange={onValueChange} />
                            </div>
                        </div>))
                    }
                </div>))
        }
    </div>


    return <div className='full-size flexy'>
        {dateItems}
        <div className='flex not-centered overflow'>
            {dateColumn}
            {productsColumn}
        </div>
    </div>

}

export default EditValues;