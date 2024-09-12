import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';
import EditProductValue from './EditProductValue';

function buildLabel(name, _for){
    return (<Label for={_for}>{name}</Label>)
}

function EditIncome(props) {
    const products = props.data.products;
    
    function onIncomeValueChange(event){
        // Get the Product
        const product = products.find(item => item.name == event.target.name);
        // Get new Memory address
        const newProduct = {...product}
        newProduct.income.val = event.target.value;
        // Change Income Value
        // Send the update to the App
        props.updateProduct(newProduct);
    }

    function onIncomeDaysChange(event){
        const product = products.find(item => item.name == event.target.name);
        const newProduct = {...product}
        newProduct.income.everyDays = event.target.value;
        props.updateProduct(newProduct);
    }

    function onFeesValueChange(event){
        const product = products.find(item => item.name == event.target.name);
        const newProduct = {...product}
        newProduct.fees.val = event.target.value;
        props.updateProduct(newProduct);
    }

    function onFeesDaysChange(event){
        const product = products.find(item => item.name == event.target.name);
        const newProduct = {...product}
        newProduct.fees.everyDays = event.target.value;
        props.updateProduct(newProduct);
    }

    // Build the whole form for one product
    function buildIncomeFeeForm(product) {
        return (
            <FormGroup>
                <Row>
                    <Col>
                        {buildLabel("Income", `income-value`)}
                    </Col>
                    <Col>
                        <Input id={`${product.name}-income-value`} name={product.name} 
                        defaultValue={product.income.val} type="number" onChange={onIncomeValueChange} />
                    </Col>
                    <Col>
                        {buildLabel("Every", `income-every`)}
                    </Col>
                    <Col>
                        <Input id={`${product.name}-income-every`} name={product.name}
                        defaultValue={product.income.everyDays} type="number" onChange={onIncomeDaysChange} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {buildLabel("Fee", `fees-value`)}
                    </Col>
                    <Col>
                        <Input id={`${product.name}-fees-value`} name={product.name}
                        defaultValue={product.fees.val} type="number" onChange={onFeesValueChange} />
                    </Col>
                    <Col>
                        {buildLabel("Every", `fees-every`)}
                    </Col>
                    <Col>
                        <Input id={`${product.name}-fees-every`} name={product.name}
                        defaultValue={product.fees.everyDays} type="number" onChange={onFeesDaysChange} />
                    </Col>
                </Row>
            </FormGroup>
        )
    }

    const productsHTML = products.map(product => (
        <FormGroup key={product.name}>
            <Row>
                {buildLabel(product.name, "name")}
            </Row>
            {buildIncomeFeeForm(product)}
        </FormGroup>
    ))


    return (
        <Form>
            {productsHTML}
        </Form>
    );
}

export default EditIncome;