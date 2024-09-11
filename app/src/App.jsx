// src/App.jsx
import React from 'react';
import Hierarchy from './HierarchyComponents/Hierarchy';
import ValuesChart from './ChartComponents/ValuesChart';
import IncomeChart from './ChartComponents/IncomeChart';

function App() {
    return (
        <div className="container-fluid">
            <div className="row full-size">
                <div className="col-3 hierarchy">
                    <Hierarchy/>
                </div>
                <div className="col chart">
                    <div className='row chart-size'>
                        <ValuesChart/>
                    </div>
                    <div className='row chart-size'>
                        <IncomeChart/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;