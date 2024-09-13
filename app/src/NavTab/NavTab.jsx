import React, { useState } from 'react';
import Hierarchy from './Hierarchy';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import EditValues from './EditValues';
import EditIncome from './EditIncome';

function NavTab(props) {
    const products = props.data.products;

    function updateProduct(name, updatedProduct){
        const prodIndex = products.findIndex(item => item.name == name);
        // If the name is not found, add the product
        if (prodIndex === -1){
            products.push(updatedProduct);
        }
        // If updatedProduct is null, delete the matching product
        else if (!updatedProduct){
            products.splice(prodIndex, 1);
        }
        // Otherwise replace the old product with the updated one
        else{
            products[prodIndex] = updatedProduct;
        }
        // Save
        props.updateData();
    }

    const [activeTab, setActiveTab] = useState('hierarchy');
    return (
        <Container className='navtab full-size'>
            <Nav tabs className='custom-nav-items'>
                <NavItem>
                    <NavLink className={activeTab == 'hierarchy' ? 'active' : ''} onClick={() => setActiveTab('hierarchy')}>
                        Hierachy
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == 'values' ? 'active' : ''} onClick={() => setActiveTab('values')}>
                        Values
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == 'income' ? 'active' : ''} onClick={() => setActiveTab('income')}>
                        Income
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="hierarchy">
                    <Hierarchy data={props.data} updateProduct={updateProduct} updateData={props.updateData} />
                </TabPane>
                <TabPane tabId="values">
                    <EditValues data={props.data} updateProduct={updateProduct} updateData={props.updateData}/>
                </TabPane>
                <TabPane tabId="income">
                    <EditIncome data={props.data} updateData={props.updateData}/>
                </TabPane>
            </TabContent>
        </Container>
    );
}

export default NavTab;