import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditProductValue from './EditProductValue';

function buildLabel(name, _for){
    return (<Label for={_for} className='item-name'>{name}</Label>)
}

function EditIncome(props) {
    const products = props.data.products;
    
    function onIncomeValueChange(event){
        const product = products.find(item => item.name == event.target.name);
        product.income.val = event.target.value;
        props.updateData();
    }

    function onIncomeDaysChange(event){
        const product = products.find(item => item.name == event.target.name);
        product.income.everyDays = event.target.value;
        props.updateData();
    }

    function onFeesValueChange(event){
        const product = products.find(item => item.name == event.target.name);
        product.fees.val = event.target.value;
        props.updateData();
    }

    function onFeesDaysChange(event){
        const product = products.find(item => item.name == event.target.name);
        product.fees.everyDays = event.target.value;
        props.updateData();
    }

    // Build the whole form for one product
    function buildIncomeFeeForm(product) {
        return (
            <FormGroup className=''>
                <Row>
                    <Col>
                        <Container className='flex'>
                            {buildLabel("Income:", `income-value`)}
                            <Input id={`${product.name}-income-value`} name={product.name}
                                defaultValue={product.income.val} onChange={onIncomeValueChange} className='on-right'/>
                        </Container>
                    </Col>
                    <Col>
                        <Container className='flex'>
                            {buildLabel("Every:", `income-every`)}
                            <Input id={`${product.name}-income-every`} name={product.name}
                                defaultValue={product.income.everyDays} onChange={onIncomeDaysChange} className='on-right'/>
                            {buildLabel("Days", `days`)}
                        </Container>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Container className='flex'>
                            {buildLabel("Fees:", `fees-value`)}
                            <Input id={`${product.name}-fees-value`} name={product.name}
                                defaultValue={product.fees.val} onChange={onFeesValueChange} className='on-right'/>
                        </Container>
                    </Col>
                    <Col>
                        <Container className='flex'>
                            {buildLabel("Every:", `fees-every`)}
                            <Input id={`${product.name}-fees-every`} name={product.name}
                                defaultValue={product.fees.everyDays} onChange={onFeesDaysChange} className='on-right'/>
                            {buildLabel("Days", `days`)}
                        </Container>
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