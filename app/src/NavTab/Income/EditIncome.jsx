import React, { useState } from 'react';
import EditIncomeRow from './EditIncomeRow';

function EditIncome(props) {
    const products = props.data.products;

    const filteredProducts = products.filter(p => p.hasIncome);

    const editIncomeRows = filteredProducts.map(product => <EditIncomeRow product={product} updateData={props.updateData} key={product.name}/>);

    return (
        <div className='full-size flexy overflow'>
            <div className='flex flex-no-wrap'>
                <div className='input-min-width'></div>
                <div className='input-min-width med-grey-hover'><p className='item-name'>Income</p></div>
                <div className='input-min-width med-grey-hover'><p className='item-name'>Every x Days</p></div>
            </div>
            <div className=''>
                {editIncomeRows}
            </div>
        </div>
    );
}

export default EditIncome;