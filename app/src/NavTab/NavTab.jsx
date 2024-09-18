import React, { useState } from 'react';
import Hierarchy from './Hierarchy/Hierarchy';
import EditValues from './Value/EditValues';
import EditIncome from './Income/EditIncome';

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
        <div className='tab-menu full-size flexy'>
            <div className='flex overflowx' style={{height: "2rem"}}>
                <button className={activeTab === 'hierarchy' ? 'tab-btn-active': 'tab-btn'} onClick={() => setActiveTab('hierarchy')}>Hierarchy</button>
                <button className={activeTab === 'values' ? 'tab-btn-active': 'tab-btn'} onClick={() => setActiveTab('values')}>Values</button>
                <button className={activeTab === 'income' ? 'tab-btn-active': 'tab-btn'} onClick={() => setActiveTab('income')}>Income</button>
            </div>
            <div className='tab-open flex-grow overflow-hidden'>
                {activeTab == "hierarchy" ?
                    <Hierarchy data={props.data} updateProduct={updateProduct} updateData={props.updateData} /> :
                    activeTab == "values" ?
                        <EditValues data={props.data} updateData={props.updateData} /> :
                        <EditIncome data={props.data} updateData={props.updateData} />
                }
            </div>
        </div>
    );
}

export default NavTab;