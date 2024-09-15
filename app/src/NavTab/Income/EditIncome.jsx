import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditIncomeRow from './EditIncomeRow';

function EditIncome(props) {
    const products = props.data.products;

    const editIncomeRows = products.map(product => <EditIncomeRow product={product} updateData={props.updateData} key={product.name}/>);

    return (
        <Container className='full-size flexy'>
            <Row>
                <Col></Col>
                <Col className='med-grey-hover'><p className='item-name'>Income</p></Col>
                <Col className='med-grey-hover'><p className='item-name'>Every x Days</p></Col>
            </Row>
            <Container className='overflowy'>
                {editIncomeRows}
            </Container>
        </Container>
    );
}

export default EditIncome;