import React, {useState} from 'react';

function Product(props) {
    const product = props.product;
    // const [name, setName] = useState(product.name);

    // Function that switch isOpen value.
    function toggleVisible(){
        const updatedProduct = {
            ...product,
            visible: !product.visible
        };
        props.updateProduct(updatedProduct);
    }

    const strikeStyle = {
        textDecoration: 'line-through'
    }

    return (
        <div className="container product" onClick={toggleVisible}>
            <p>{
            product.visible ? 
                product.name :
                (<span style={strikeStyle}>{product.name}</span>)
            }</p>
        </div>
    );
}

export default Product;