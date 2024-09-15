import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditIncomeRow from './EditIncomeRow';

function EditIncome(props) {
    const products = props.data.products;

    const filteredProducts = products.filter(p => p.hasIncome);

    const editIncomeRows = filteredProducts.map(product => <EditIncomeRow product={product} updateData={props.updateData} key={product.name}/>);

    return (
        <Container className='full-size flexy overflow'>
            <Row className='flex flex-no-wrap'>
                <Col className='input-min-width'></Col>
                <Col className='input-min-width med-grey-hover'><p className='item-name'>Income</p></Col>
                <Col className='input-min-width med-grey-hover'><p className='item-name'>Every x Days</p></Col>
            </Row>
            <Container className=''>
                {editIncomeRows}
            </Container>
        </Container>
    );
}

export default EditIncome;