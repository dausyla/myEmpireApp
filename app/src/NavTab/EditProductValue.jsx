import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

function EditProductValue(props) {
    const product = props.product;
    const updateProductValue = props.updateProductValue; 

    function valueChanged(event){
        const newValue = event.target.value;
        updateProductValue(product.name, newValue);
    }

    return (
            <Row>
                <Col md={4}>
                    <Label for={product.name}>
                        {product.name}:
                    </Label>
                </Col>
                <Col md={8}>
                    <Input id="value" name="value" defaultValue={product.value} type="number" onChange={valueChanged} />
                </Col>
            </Row>
    );
}

export default EditProductValue;