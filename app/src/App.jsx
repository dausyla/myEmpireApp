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
    makeDataVisible(fakeData);

    const [Data, SetData] = useState(fakeData);

    function updateData(){
        // Create a whole new object
        const newData = JSON.parse(JSON.stringify(Data));
        SetData(newData);
    }

    return (
        <Container fluid style={{padding:0}}>
            <SplitPane minSize={15} maxSize={40} defaultSize={20}>
                <div>
                    <NavTab data={Data} updateData={updateData} />
                </div>
                <div>
                    <Row className="chart-size">
                        <ValuesChart data={Data} />
                    </Row>
                    <Row className="chart-size">
                        <IncomeChart data={Data} />
                    </Row>
                </div>
            </SplitPane>
            {/* <Row className="full-size">
                <Col xs={3} className="navtab">
                </Col>
                <Col className="chart">
                </Col>
            </Row> */}
        </Container>
    );
}

export default App;