import React, {useState} from 'react';
import { Col, Row, Button, Alert, Container, Input, Form} from 'reactstrap';

function Product(props) {    
    const product = props.product;
    
    function toggleVisible(){
        product.visible = !product.visible;
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
        <Container className='flex'>
            <Input id={`rename-input-${product.name}`} onChange={isRenameValid} defaultValue={product.name}></Input>
            <Button onClick={saveName} disabled={!renameValid}>V</Button>
        </Container>
    )
    const productName = isRenaming ? renameInput : (
        product.visible ? 
        <p className='item-name'>{product.name}</p>:
        <p className='item-name line-through'>{product.name}</p>
    );

    const buttons = (
        <Container className='flex nowrap'>
            <Button className="flex-on-right" onClick={renameProduct}>R</Button>
            <Button onClick={toggleVisible}>V</Button>
            <Button onClick={tryDeleteProduct}>D</Button>
        </Container>)


    return (
            <Container className='flex med-grey-hover'>
                {productName}
                <Form><Input type="color" className='color-input' onChange={changeColor} value={product.color}></Input></Form>
                {buttons}
            </Container>
    );
}

export default Product;