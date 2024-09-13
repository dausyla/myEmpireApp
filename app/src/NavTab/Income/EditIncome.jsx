import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditProductValue from '../Value/EditProductValue';
import EditIncomeValue from './EditIncomeValue';

function buildLabel(name, _for){
    return (<Label for={_for} className='item-name'>{name}</Label>)
}

function EditIncome(props) {
    const products = props.data.products;

    const productsHTML = products.map(product => (
        <FormGroup key={product.name} className='med-grey-hover'>
            <Row>
                {buildLabel(product.name, "name")}
            </Row>
            <EditIncomeValue product={product} updateData={props.updateData}/>
        </FormGroup>
    ))


    return (
        <Form>
            {productsHTML}
        </Form>
    );
}

export default EditIncome;