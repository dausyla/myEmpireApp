// src/App.jsx
import React from 'react';
import Hierarchy from './hierarchy';
import Chart from './chart';

function App() {
  return (
    <div class="container-fluid">
        <div class="row full-size">
            <div class="col-3 hierarchy">
                <Hierarchy/>
            </div>
            <div class="col chart">
                <Chart/>
            </div>
        </div>
    </div>
  );
}

export default App;