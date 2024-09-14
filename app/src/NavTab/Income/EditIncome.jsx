import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditProductValue from '../Value/EditProductValue';
import EditIncomeRow from './EditIncomeRow';

function EditIncome(props) {
    const products = props.data.products;

    const editIncomeRows = products.map(product => <EditIncomeRow product={product} updateData={props.updateData} key={product.name}/>);

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col className='med-grey-hover'><p className='item-name'>Income</p></Col>
                <Col className='med-grey-hover'><p className='item-name'>Every x Days</p></Col>
            </Row>
            {editIncomeRows}
        </Container>
    );
}

export default EditIncome;