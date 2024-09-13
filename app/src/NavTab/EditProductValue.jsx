import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, Container } from 'reactstrap';

function EditProductValue(props) {
    const product = props.product;
    const updateProductValue = props.updateProductValue; 

    function valueChanged(event){
        const newValue = event.target.value;
        updateProductValue(product.name, newValue);
    }

    return (
        <Container className='flex med-grey-hover'>
            <Label for={product.name} className='item-name'>
                {product.name}:
            </Label>
            <Input id="value" name="value" defaultValue={product.value} onChange={valueChanged} className='on-right right-input med-grey-focus' />
        </Container>
    );
}

export default EditProductValue;