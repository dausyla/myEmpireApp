import React, { useState } from 'react';
import {Table} from '../../Utils/Table'

function Hierarchy({data, updateData}) {
    const wallet = data.wallet;

    function createProduct(name) {
        wallet.nextId++;
        return {
            id: wallet.nextId - 1,
            name: name,
            type: 'p',
            visible: true,
            hasIncome: true,
            hasValue: true,
            color: '#30aa30',
            values: [],
            incomes: [],
        }
    }

    const header = ['Product', 'Visible', 'Has Value', 'Has Income'];

    function buildRows(product, prefix = '') {
        function onCheckChange(event) {
            const property = event.target.name;
            product[property] = event.target.checked;
            updateData();
        }
        function deleteProduct() {
            parent.products = parent.products.filter(p => p.id != product.id);
            updateData();
        }
        function toggleOpen() {
            product.isOpen = !product.isOpen;
            updateData();
        }
        const rowHeader = product.type === 'p' ?
            <div className='flex align-center'>
                {prefix}{product.name}
                <button onClick={deleteProduct}>-</button>
            </div> :
            <div className='flex align-center'>
                <div className='clickable' onClick={toggleOpen}>
                    {prefix}{(product.isOpen ? '▽ ' : '▷ ') + product.name}
                </div>
                {product.id !== 0 ? <button onClick={deleteProduct}>-</button> : '' /* if it's not the root */}
            </div>;

        const otherCols = [
            <div className='flex justify-center'>
                <input name='visible' defaultChecked={product.visible} onChange={onCheckChange} type='checkbox' />
            </div>,
            product.type === 'p' ?
                <div className='flex justify-center'>
                    <input name='hasValue' defaultChecked={product.hasValue} onChange={onCheckChange} type='checkbox' />
                </div> : '',
            product.type === 'p' ?
                <div className='flex justify-center'>
                    <input name='hasIncome' defaultChecked={product.hasIncome} onChange={onCheckChange} type='checkbox' />
                </div> : '',
        ]

        const childRows = product.type === 'f' && product.isOpen ?
        product.products.reduce((res, p) => {res.push(...buildRows(p, prefix + '\xa0| ')); return res}, [])
        : [];

        return [[rowHeader, ...otherCols], ...childRows]
    }
    const rows = buildRows(wallet);

    const tableContent = [header, ...rows];

    const [addProductDisabled, setAddProductDisabled] = useState(true);
    function verifyNewProductName(event) {
        setAddProductDisabled(event.target.value.length !== 0);
    }
    function addProduct() {
        const input = document.getElementById('add-player-input');
        const name = input.value;
        input.value = '';
        setAddProductDisabled(true);
        const newProduct = createProduct(name);
        newProduct.values = data.valuesDates.map(() => 0)
        wallet.products.push(newProduct)
        updateData();
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