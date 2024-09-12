import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';
import EditProductValue from './EditProductValue';

function dateToString(date){
    return date.toISOString().split('T')[0];
}

function EditValues(props) {
    // Get some variables (cleaner)
    const products = props.data.products;
    const dates = props.data.valuesDates;

    // Set the Current Date Variable and related functions
    const [currentDate, setCurrentDate] = useState(new Date())
    function setToToday(){
        const newDate = new Date();
        setCurrentDate(newDate);
    }
    function updateDate(event){
        const newDate = new Date(event.target.value);
        setCurrentDate(newDate);
    }
    const dateIndex = dates.findIndex(d => d == dateToString(currentDate));

    // Update the product Value at this date (triggered in EditProductValue.jsx)
    function updateProductValue(name, newValue){
        const product = products.find(p => p.name == name);
        // If first value entered, fill the list with 0
        if (product.values.length === 0){
            product.values = dates.map(item => 0);
        }
        product.values[dateIndex] = newValue == '' ? 0 : parseFloat(newValue);
        // If there are no values for the product, reset the list to []
        if (product.values.find(v => v !== 0) === -1){
            product.values = [];
        }
        props.updateData();
    }

    // Prepare the products
    const preparedProducts = dateIndex !== -1 ? products.map(item => {
        return {
            name: item.name,
            value: item.values.length > 0 ? item.values[dateIndex] : 0
        }
    }) : [];
    // Convert it in HTML
    const productsHTML = preparedProducts.map(p => <EditProductValue key={`${p.name}_${dateIndex}`} product={p} updateProductValue={updateProductValue}/>);

    // Init all the data to a current date
    function addDataToCurrentDate(){
        let i = 0;
        const date = dateToString(currentDate);
        while(i < dates.length && dates[i] < date){
            i++;
        }
        dates.splice(i, 0, date);
        if (dates.length > 1){
            // take the previous value unless it's 0 => take the next one
            const indexToTake = i > 0 ? i - 1 : 0;
            products.forEach(p => {
                if (p.values.length > 0){
                    p.values.splice(i, 0, p.values[indexToTake]);
                }
            });
        }
        else{
            products.forEach(p => { 
                p.values = [Math.floor(Math.random() * 500 + 500)]; // set a random value between 500 and 1000
            });
        }
        props.updateData();
    }

    // button If the date is not registered yet
    const addDateForm = (
        <Button onClick={addDataToCurrentDate}>
            Add data to this date
        </Button>
    );

    // Delete a date
    function deleteDate(){
        dates.splice(dateIndex, 1);
        products.forEach(p => {
            p.values.splice(dateIndex, 1);
        });
        props.updateData();
    }

    // Delete date button if the date exists
    const deleteDateButton = (
        <Button onClick={deleteDate}>
            Delete this date
        </Button>
    );

    return (
        <Form>
            <FormGroup>
                <Row>
                    <Col>
                        <Input className='date-form' id="date" name="date" value={dateToString(currentDate)} type="date" onChange={updateDate} />
                    </Col>
                    <Col>
                        <Button onClick={setToToday}>Today</Button>
                    </Col>
                </Row>
            </FormGroup>
            {
                dateIndex !== -1 ?
                    <FormGroup>
                        {productsHTML}
                        {deleteDateButton}
                    </FormGroup> :
                    addDateForm
            }
        </Form>
    );
}

export default EditValues;