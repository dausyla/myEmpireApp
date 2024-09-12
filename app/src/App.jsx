import React, { useState } from 'react';
import NavTab from './NavTab/NavTab';
import ValuesChart from './ChartComponents/ValuesChart';
import IncomeChart from './ChartComponents/IncomeChart';
import { fakeData } from './Data';

//BootStrap
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";

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
        <Container fluid>
            <Row className="full-size">
                <Col xs={3} className="navtab">
                    <NavTab data={Data} updateData={updateData} />
                </Col>
                <Col className="chart">
                    <Row className="chart-size">
                        <ValuesChart data={Data} />
                    </Row>
                    <Row className="chart-size">
                        <IncomeChart data={Data} />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default App;