import React, { useState } from 'react';
import {Table} from '../../Utils/Table'

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
    const updateData = props.updateData;

    const header = ['Product', 'Visible', 'Has Value', 'Has Income'];

    function buildProductRow(product) {
        function onCheckChange(event){
            const property = event.target.name;
            product[property] = event.target.checked;
            updateData();
        }
        function deleteProduct(event){
            const productIndex = products.findIndex(p => p.name == event.target.name);
            products.splice(productIndex, 1);
            updateData();
        }
        return [
            <div className='flex align-center'>
                <button name={product.name} onClick={deleteProduct}>-</button>&nbsp;{product.name}
            </div>,
            <div className='flex justify-center'>
                <input name='visible' defaultChecked={product.visible} onChange={onCheckChange} type='checkbox' />
            </div>,
            <div className='flex justify-center'>
                <input name='hasValue' defaultChecked={product.hasValue} onChange={onCheckChange} type='checkbox' />
            </div>,
            <div className='flex justify-center'>
                <input name='hasIncome' defaultChecked={product.hasIncome} onChange={onCheckChange} type='checkbox' />
            </div>,
        ]
    }
    const productRows = products.map(p => buildProductRow(p));

    const tableContent = [header, ...productRows];
    
    const [addProductDisabled, setAddProductDisabled] = useState(true);
    function verifyNewProductName() {
        const name = document.getElementById('add-player-input').value;
        setAddProductDisabled(name.length === 0 || products.find(p => p.name == name));
    }
    function addProduct() {
        const input = document.getElementById('add-player-input');
        const name = input.value;
        input.value = '';
        setAddProductDisabled(true);
        const newProduct = createProduct(name);
        newProduct.values = props.data.valuesDates.map(() => 0)
        props.data.products.push(newProduct)
        props.updateData();
    }
    const addProductHTML = <div className='flex'>
        <input id="add-player-input" name="add-player-input" placeholder="New Product Name" onChange={verifyNewProductName} />
        <button className='on-right' disabled={addProductDisabled} onClick={addProduct}>+</button>
    </div>

    return <div className='flexy full-size'>
        {addProductHTML}
        {Table(tableContent)}
    </div>;

}

export default Hierarchy;