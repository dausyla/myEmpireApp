import React, {useState} from 'react';
import { Col, Row, Button, Alert, Container, Input, Form} from 'reactstrap';

function Product(props) {    
    const product = props.product;
    
    function toggleVisible(){
        product.visible = !product.visible;
        props.updateData();
    }
    const strikeStyle = {
        textDecoration: 'line-through'
    }

    function tryDeleteProduct(){
        props.updateProduct(product.name, null);
    }
    function changeColor(event){
        product.color = event.target.value;
        props.updateData();   
    }

    const buttons = (
        <Container className='on-right'>
            <Button onClick={toggleVisible}>V</Button>
            <Button onClick={tryDeleteProduct}>D</Button>
        </Container>)

    return (
        <Container className='flex med-grey-hover'>
            <p className='item-name'>{
                product.visible ?
                    product.name :
                    (<span style={strikeStyle}>{product.name}</span>)
            }</p>
            <Form><Input type="color" className='color-input' onChange={changeColor} value={product.color}></Input></Form>
            {buttons}
        </Container>
    );
}

export default Product;