import React, {useState} from 'react';
import { Col, Row, Button, Alert, Container} from 'reactstrap';

function Product(props) {
    const product = props.product;
    // const [name, setName] = useState(product.name);

    // Function that switch isOpen value.
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

    const buttons = (
        <Container className='on-right'>
            <Button onClick={toggleVisible}>V</Button>
            <Button onClick={tryDeleteProduct}>D</Button>
        </Container>)

    return (
        <Container className='product flex'>
            <p className='item-name'>{
                product.visible ?
                    product.name :
                    (<span style={strikeStyle}>{product.name}</span>)
            }</p>
            {buttons}
        </Container>
    );
}

export default Product;