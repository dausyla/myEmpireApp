import React, { useEffect, useState } from 'react';
import {Table} from '../../Utils/Table'
import { RenamableName } from '../../Utils/Inputs';



function Hierarchy({data, updateData}) {
    const wallet = data.wallet;

    function createNewFolder(){
        wallet.nextId++;
        return {
            id: wallet.nextId - 1,
            name: 'New Folder',
            type: 'f',
            visible: true,
            color: "#aa2020",
            isOpen: false,
            products: [],
        }
    }
    function createNewProduct(){
        wallet.nextId++;
        return {
            id: wallet.nextId - 1,
            name: 'New Product',
            type: 'p',
            visible: true,
            hasValue: true,
            hasIncome: true,
            color: "#aa2020",
            values: wallet.valuesDates.map(_ => 0),
            incomes: [],
        }
    }

    const [renamingProduct, setRenamingProduct] = useState(-1);
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            setRenamingProduct(-1);
        }
    }
    // Hook to handle clicks outside the input
    function handleClickOutside(event) {
        const objectId = event.target.id;
        if (!(objectId && objectId === renamingProduct + '-rename')) {
            setRenamingProduct(-1);
        }
    }

    useEffect(() => {
        if (renamingProduct >= 0) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    })

    const prefixStyle = {height: '100%', width: '0.1rem',
        backgroundColor: 'grey', marginLeft: '0.35rem', marginRight: '0.45rem'}
    let prefixCount=0;
    function getNewPrefix(){
        prefixCount++;
        return <div style={prefixStyle} key={prefixCount}/>
    }

    function deleteProduct(id, from=wallet){
        const product = from.products.find(p => p.id === id);
        if (product){
            from.products = from.products.filter(p => p.id !== id);
            return product;
        }
        else {
            for (let p of Object.values(from.products)){
                if (p.type === 'f'){
                    const res = deleteProduct(id, p);
                    if (res){
                        return res;
                    }
                }
            }
        }
        return null;
    }

    function moveProduct(productId, to){
        const product = deleteProduct(productId);
        to.products.push(product);
        updateData();
    }

    function buildHierarchy(product = wallet, prefixs =[]){
        function toggleOpen() {
            product.isOpen = !product.isOpen;
            updateData();
        }

        function onColorChange(e){
            product.color = e.target.value;
            updateData();
        }

        function toggleCheckBox(e){
            product[e.target.name] = e.target.checked;
            updateData();
        }

        function onDelete(){
            deleteProduct(product.id);
            updateData()
        }

        function newFolder(){
            const newFolder_ = createNewFolder();
            product.products.push(newFolder_);
            product.isOpen = true;
            updateData();
            setRenamingProduct(newFolder_.id);
        }
        
        function newProduct(){
            const newProduct_ = createNewProduct();
            product.products.push(newProduct_);
            product.isOpen = true;
            updateData();
            setRenamingProduct(newProduct_.id);
        }

        const buttons = <div className='flex full-size align-center'>
            <input className='hierarchy-input' type='color' onChange={onColorChange} defaultValue={product.color} />
            {product.type === 'f' ? <button className='hierarchy-input' onClick={newProduct}>+</button> : ''}
            {product.type === 'f' ? <button className='hierarchy-input' onClick={newFolder}>+</button> : ''}
            <div className='margin-left-auto'>
                {product.type === 'p' ?
                    <>
                        <input className='hierarchy-input' name='hasIncome' type='checkbox' defaultChecked={product.hasIncome} onChange={toggleCheckBox} />
                        <input className='hierarchy-input' name='hasValue' type='checkbox' defaultChecked={product.hasValue} onChange={toggleCheckBox} />
                    </>
                    : ''
                }
                <input className='hierarchy-input' name='visible' type='checkbox' defaultChecked={product.visible} onChange={toggleCheckBox} />
                {product.id !== 0 ? <button className='hierarchy-input' onClick={onDelete}>-</button> : ''}
            </div>
        </div>

        function handleDragStart(e) {
            e.dataTransfer.setData('text/plain', product.id); // Store product ID in data transfer
        }

        function handleDrop(e) {
            e.preventDefault();
            const draggedProductId = parseInt(e.dataTransfer.getData('text/plain'));
            moveProduct(draggedProductId, product); // Custom function to move dragged product to the dropped folder
        }

        function handleDragOver(e) {
            e.preventDefault(); // Necessary to allow a drop
        }

        if (product.type === 'f') {
            const folderName = <div className='flex hierarchy-folder'>
                <div className='clickable flex' onClick={toggleOpen}
                    draggable={product.id !== 0} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver}>
                    {product.isOpen ? '▽\xa0' : '▷\xa0'}{RenamableName(product, renamingProduct, setRenamingProduct, updateData)}
                </div>
                &nbsp;{buttons}
            </div>;

            const childs = product.products.map(p => buildHierarchy(p, [...prefixs, getNewPrefix()]))

            return <div key={product.id} className='flexy full-size'>
                {folderName}
                {product.isOpen ?
                    <div className='flex'>
                        <div className='align-self-stretch'>{getNewPrefix()}</div>
                        <div className='flexy full-size'>
                            {childs}
                        </div>
                    </div>
                    : ''}
            </div>
        } else {
            const productName = <div className='flex ' draggable onDragStart={handleDragStart}>
                <div className='clickable' >{RenamableName(product, renamingProduct, setRenamingProduct, updateData)}</div>
            </div>;
            return <div key={product.id} className='flex hierarchy-product'>
                {productName}
                &nbsp;{buttons}
            </div>
        }
    }

    return buildHierarchy();

    const header = ['Product', 'Visible', 'Has Value', 'Has Income'];

    function buildRows(product, prefixs = []) {
        function onCheckChange(event) {
            const property = event.target.name;
            product[property] = event.target.checked;
            updateData();
        }
        function deleteProduct() {
            parent.products = parent.products.filter(p => p.id != product.id);
            updateData();
        }
        const rowHeader = product.type === 'p' ?
            <div className='flex align-center'>
                <div className='flex align-self-stretch'>{prefixs}</div>
                {product.name}
                <button onClick={deleteProduct} className='margin-left-auto'>-</button>
            </div> :
            <div className='flex align-center'>
                <div className='flex align-self-stretch'>{prefixs}</div>
                <div className='clickable align-center flex' onClick={toggleOpen}>
                    {(product.isOpen ? '' : '') + product.name}
                </div>
                {product.id !== 0 ? <button onClick={deleteProduct} className='margin-left-auto'>-</button> : '' /* if it's not the root */}
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
            product.products.reduce((res, p) => { res.push(...buildRows(p, [...prefixs, getNewPrefix()])); return res }, [])
            : [];

        return [[rowHeader, ...otherCols], ...childRows]
    }
    const rows = buildRows(wallet);

    const tableContent = [header, ...rows];

    const [addProductDisabled, setAddProductDisabled] = useState(true);
    function verifyNewProductName(event) {
        setAddProductDisabled(event.target.value.length === 0);
    }
    function addProduct() {
        const input = document.getElementById('add-player-input');
        const name = input.value;
        input.value = '';
        setAddProductDisabled(true);
        const newProduct = createProduct(name);
        newProduct.values = wallet.valuesDates.map(() => 0)
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