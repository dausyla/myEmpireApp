import React, { useState } from 'react';
import Product from './Product';
import { Col, Container, Input, Row, Button } from 'reactstrap';

function createProduct(name) {
    return {
        visible: true,
        name: name,
        values: [],
        incomes: [],
        color: '#30aa30'
    }
}

function Hierarchy(props) {
    const products = props.data.products;

    const hierarchy = products.map(item => <Product product={item} key={item.name} products={products}
        updateData={props.updateData} updateProduct={props.updateProduct}/>
    );

    const [addProductDisabled, setAddProductDisabled] = useState(true);
    function verifyNewProductName(event) {
        const name = document.getElementById('add-player-input').value;
        if (props.data.products.find(p => p.name == name)) {
            setAddProductDisabled(true);
        } else if (name.length === 0) {
            setAddProductDisabled(true);
        } else {
            setAddProductDisabled(false);
        }
    }

    function addProduct(){
        const input = document.getElementById('add-player-input');
        const name = input.value;
        input.value = '';
        const prod = createProduct(name);
        props.updateProduct(name, prod); // Will create and save the Data
    }

    const addProductHTML = <Container className='flex'>
            <Input id="add-player-input" name="add-player-input" placeholder="New Product Name" onChange={verifyNewProductName} />
            <Button disabled={addProductDisabled} onClick={addProduct} className='on-right'>+</Button>
    </Container>

    return (
        <Container className='full-size flexy hierarchy'>
            {addProductHTML}
            <Container className='overflow'>
            {hierarchy}
            </Container>
        </Container>
    );
}

export default Hierarchy;