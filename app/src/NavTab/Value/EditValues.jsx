import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';

function dateToString(date){
    return date.toISOString().split('T')[0];
}

function EditValues(props) {
    // Get some variables (cleaner)
    const products = props.data.products;
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
    const dateItems = <Container className='flex flex-wrap'>
            <Button disabled={!newDateValid} onClick={addDate}>Add</Button>
            <Input className='input-date' id="date" name="date" value={dateToString(currentDate)} type="date" onChange={updateDate} />
            <Button onClick={setToToday}>Today</Button>
    </Container>

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
        <Row>&nbsp;</Row>
        {dates.map(d => <Row className='med-grey-hover' key={d}>
            <Container className='flex'>
                <Button onClick={deleteDate} name={d}>-</Button>
                <Input className='input-date' defaultValue={d} name={d} type='date' onChange={onChangeDate}/>
            </Container>
        </Row>)}
    </div>

    function onValueChange(event){
        const name = event.target.getAttribute('data-product-name');
        const index = parseInt(event.target.getAttribute('data-value-index'));
        const product = products.find(p => p.name == name);
        product.values[index] = event.target.value;
        props.updateData();
    }

    const productsColumn = <Col className='flex not-centered'>
        {
            products.map(p => (
                <Col id={`product-col-${p.name}`} key={p.name}>
                    <Row><p className='item-name'>{p.name}</p></Row>
                    {p.values.map((v, i) => (
                        <Row className='flex' key={p.name + i}>
                            <Container className='flex'>
                                <Input defaultValue={v} data-product-name={p.name} data-value-index={i} className='on-right input-min-width' onChange={onValueChange} />
                            </Container>
                        </Row>))
                    }
                </Col>))
        }
    </Col>


    return <Container className='full-size flexy'>
        {dateItems}
        <Container className='flex not-centered overflow'>
            {dateColumn}
            {productsColumn}
        </Container>
    </Container>

}

export default EditValues;