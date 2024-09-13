import React, { useState } from 'react';
import NavTab from './NavTab/NavTab';
import ValuesChart from './ChartComponents/ValuesChart';
import IncomeChart from './ChartComponents/IncomeChart';
import { fakeData } from './Data';

//BootStrap
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import SplitPane from './SplitPane';

function makeDataVisible(data) {
    for (let i in data.products) {
        data.products[i].visible = true;
    }
}

function App() {
    // Add the visible property and sets it to true to all products.
    const [Data, SetData] = useState(fakeData);

    function updateData(){
        // Create a whole new object
        const newData = JSON.parse(JSON.stringify(Data));
        SetData(newData);
    }

    return (
        <Container className='screen-size'>
            <SplitPane minSize={15} maxSize={70} defaultSize={20}>
                <NavTab data={Data} updateData={updateData} />
                <SplitPane horizontal={true}>
                    <ValuesChart data={Data} />
                    <IncomeChart data={Data} />
                </SplitPane>
            </SplitPane>
        </Container>
    );
}

export default App;