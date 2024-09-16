import React, {useState} from 'react';

function Product(props) {    
    const product = props.product;
    
    function checkVisible(event){
        product.visible = event.target.checked;
        props.updateData();
    }
    function checkHasValue(event){
        product.hasValue = event.target.checked;
        props.updateData();
    }
    function checkHasIncome(event){
        product.hasIncome = event.target.checked;
        props.updateData();
    }
    function tryDeleteProduct(){
        props.updateProduct(product.name, null);
    }
    function changeColor(event){
        product.color = event.target.value;
        props.updateData();   
    }

    const [isRenaming, setIsRenaming] = useState(false);
    function renameProduct(event) {
        setIsRenaming(!isRenaming);
    }
    function saveName(){
        const name = document.getElementById('rename-input-' + product.name).value;
        product.name = name;
        props.updateData();
        setIsRenaming(false);
    }
    const [renameValid, setRenameValid] = useState(true);
    function isRenameValid(event){
        const name = event.target.value;
        if (name == product.name || props.products.findIndex(p => p.name == name) === -1){
            setRenameValid(true);
        }
        else{
            setRenameValid(false);
        }
    }
    const renameInput = (
        <div className='flex'>
            <input id={`rename-input-${product.name}`} onChange={isRenameValid} defaultValue={product.name}></input>
            <button className='' onClick={saveName} disabled={!renameValid}>V</button>
        </div>
    )
    const productName = isRenaming ? renameInput : (
        product.visible ? 
        <p className='item-name'>{product.name}</p>:
        <p className='item-name line-through'>{product.name}</p>
    );

    const buttons = (
        <div className='flex nowrap'>
            <button className="flex-on-right" onClick={renameProduct}>R</button>
            <button className='' onClick={tryDeleteProduct}>D</button>
            <input type="checkbox" className='form-control' onChange={checkVisible} defaultChecked={product.visible}></input>
            <input type="checkbox" className='form-control' onChange={checkHasValue} defaultChecked={product.hasValue}></input>
            <input type="checkbox" className='form-control' onChange={checkHasIncome} defaultChecked={product.hasIncome}></input>
        </div>)


    return (
            <div className='flex med-grey-hover'>
                {productName}
                <input type="color" className='color-input' onChange={changeColor} value={product.color}></input>
                {buttons}
            </div>
    );
}

export default Product;