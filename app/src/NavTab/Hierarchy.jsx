import React from 'react';
import Product from './Product';
import { Container } from 'reactstrap';

function Hierarchy(props) {
    const products = props.data.products;

    function deleteProduct(name){
        const productIndex = products.findIndex(p => p.name == name);
        products.splice(productIndex, 1);
        props.updateWholeData();
    }

    const hierarchy = products.map(item => <Product product={item} key={item.name}
        updateProduct={props.updateProduct} deleteProduct={deleteProduct}/>);

    const test= 0;

    return (
        <Container className='hierarchy'>
            {hierarchy}
        </Container>
    );
}

export default Hierarchy;