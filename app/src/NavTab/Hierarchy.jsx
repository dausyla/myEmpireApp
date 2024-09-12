import React from 'react';
import Folder from './Folder';
import Product from './Product';
import { fakeData } from '../Data';

function Hierarchy(props) {
    const products = props.data.products;

    const hierarchy = products.map(item => <Product product={item} key={item.name} updateProduct={props.updateProduct}/>)

    return (
        <div className="container-fluid hierarchy">
            {hierarchy}
        </div>
    );
}

export default Hierarchy;