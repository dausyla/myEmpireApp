import React, { useState } from 'react';
import Product from './Product';

function createProduct(name) {
    return {
        visible: true,
        name: name,
        values: [],
        incomes: [],
        hasIncome: true,
        hasValue: true,
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
        const newProduct = createProduct(name);
        newProduct.values = props.data.valuesDates.map(() => 0)
        props.data.products.push(newProduct)
        props.updateData();
    }

    const addProductHTML = <div className='flex'>
            <input id="add-player-input" name="add-player-input" placeholder="New Product Name" onChange={verifyNewProductName} />
            <button className='on-right' disabled={addProductDisabled} onClick={addProduct}></button>
    </div>

    return (
        <div className='full-size flexy hierarchy'>
            {addProductHTML}
            <div className='overflow'>
            {hierarchy}
            </div>
        </div>
    );
}

export default Hierarchy;