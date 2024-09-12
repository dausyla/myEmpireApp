import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';
import EditProductValue from './EditProductValue';

function dateToString(date){
    return date.toISOString().split('T')[0];
}

function getDateIndex(date, data){
    for (let i in data.valuesDates){
        if (data.valuesDates[i] == date){
            return i;
        }
    }
    return -1;
}

function getProductFromName(products, name){
    return products.find(item => item.name == name);
}

function onlyZeros(list){
    for (let i in list){
        if (list[i] !== 0){
            return false;
        }
    }
    return true;
}

function EditValues(props) {
    // Current date React variable
    const [currentDate, setCurrentDate] = useState(new Date())

    // Update the Date
    function setToToday(){
        const newDate = new Date();
        setCurrentDate(newDate);
    }
    // Update the Date
    function updateDate(event){
        const newDate = new Date(event.target.value);
        setCurrentDate(newDate);
    }

    // Update the product Value at this date (triggered in EditProductValue.jsx)
    function updateProductValue(name, newValueString){
        const updatedProduct = {
            ...getProductFromName(props.data.products, name)
        };
        // If first value entered, fill the list with 0
        if (updatedProduct.values.length === 0){
            updatedProduct.values = props.data.valuesDates.map(item => 0);
        }
        // If the value is a correct number: update the list
        const newValue = parseFloat(newValueString);
        updatedProduct.values[dateIndex] = isNaN(newValue) ? 0 : newValue;
        // If there are no values for the product, reset the list to []
        if (onlyZeros(updatedProduct.values)){
            updatedProduct.values = [];
        }
        props.updateProduct(updatedProduct);
    }


    // Get the values of product at this date
    const dateIndex = getDateIndex(dateToString(currentDate), props.data);
    const productsValues = dateIndex !== -1 ? props.data.products.map(item => {
        return {
            name: item.name,
            value: item.values.length > 0 ? item.values[dateIndex] : 0
        }
    }) : [];
    // Convert it in HTML
    const productsHTML = productsValues.map(item => <EditProductValue key={`${item.name}_${dateIndex}`} product={item} updateProductValue={updateProductValue}/>);

    // Init all the data to a current date without data
    function addDataToCurrentDate(){
        let i = 0;
        const date = dateToString(currentDate);
        const dates = props.data.valuesDates
        while(i < dates.length && dates[i] < date){
            i++;
        }
        dates.splice(i, 0, date);
        if (dates.length > 1){
            // take the previous value unless it's 0 => take the next one
            const indexToTake = i > 0 ? i - 1 : 0;
            props.data.products.forEach(product => {
                if (product.values.length > 0){
                    product.values.splice(i, 0, product.values[indexToTake]);
                }
            });
        }
        else{
            props.data.products.forEach(product => { 
                product.values = [Math.floor(Math.random() * 500 + 500)]; // set a random value between 500 and 1000
            });
        }
        props.updateWholeData();
    }

    // button If the date is not registered yet
    const addDateForm = (
        <Button onClick={addDataToCurrentDate}>
            Add data to this date
        </Button>
    );

    // Delete a date
    function deleteDate(){
        props.data.valuesDates.splice(dateIndex, 1);
        props.data.products.forEach(product => {
            product.values.splice(dateIndex, 1);
        });
        props.updateWholeData();
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