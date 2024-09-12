import React, {useState} from 'react';
import { Col, Row, Button, Alert} from 'reactstrap';

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
        <Col>
        <Button onClick={toggleVisible}>V</Button>
        <Button onClick={tryDeleteProduct}>D</Button>
        </Col>
    )

    return (
        <div className="container product">
            <Row>
                <Col>
                    <p>{
                        product.visible ?
                            product.name :
                            (<span style={strikeStyle}>{product.name}</span>)
                    }</p>
                </Col>
                {buttons}
            </Row>
        </div>
    );
}

export default Product;