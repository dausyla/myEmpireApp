// src/App.jsx
import React, {useState} from 'react';
import Hierarchy from './NavTab/Hierarchy';
import ValuesChart from './ChartComponents/ValuesChart';
import IncomeChart from './ChartComponents/IncomeChart';
import { fakeData } from './Data';

function makeDataVisible(data){
    for (let i in data.products){
        data.products[i].visible = true;
    }
}

function App() {
    // Add the visible property and sets it to true to all products.
    makeDataVisible(fakeData);

    const [Data, SetData] = useState(fakeData);

    function updateProduct(updatedProduct){
        const updatedProducts = Data.products.map(p => p.name === updatedProduct.name ? updatedProduct : p);
        SetData({
            ...Data,
            products: updatedProducts
        });
    }

    const hierarchy = (<Hierarchy data={Data} updateProduct={updateProduct}/>);
    const valuesChart = (<ValuesChart data={Data}/>);
    const incomeChart = (<IncomeChart data={Data}/>);

    return (
        <div className="container-fluid">
            <div className="row full-size">
                <div className="col-3 hierarchy">
                    {hierarchy}
                </div>
                <div className="col chart">
                    <div className='row chart-size'>
                        {valuesChart}
                    </div>
                    <div className='row chart-size'>
                        {incomeChart}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;