import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, Container } from 'reactstrap';

function EditProductValue(props) {
    const product = props.product;
    const updateProductValue = props.updateProductValue; 

    const [valid, setValid] = useState(true);

    function valueChanged(event){
        const val = event.target.value == '' ? 0 : event.target.value;
        const reg = /^-?\d+$/
        if (reg.test(val)){
            updateProductValue(product.name, val);
            setValid(true);
        }
        else{
            setValid(false);
        }
    }

    const inputClass = `on-right right-input med-grey-focus ${valid ? '' : 'incorrect-input'}`;

    return (
        <Container className='flex med-grey-hover'>
            <Label for={product.name} className='item-name'>
                {product.name}:
            </Label>
            <Input id="value" name="value" defaultValue={product.value} onChange={valueChanged} className={inputClass} />
        </Container>
    );
}

export default EditProductValue;