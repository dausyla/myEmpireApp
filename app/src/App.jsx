import React, { useState, useRef} from 'react';
import Header from './Header';
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
    const [Data, SetData] = useState(null);
    function updateData(){
        // Create a whole new object
        const newData = JSON.parse(JSON.stringify(Data));
        SetData(newData);
    }

    const file = useRef(null);
    function updateFile(file){
            const reader = new FileReader();
            reader.onload = function(e){
                const fileContent = e.target.result;
                const fileData = JSON.parse(fileContent);
                SetData(fileData);
            }
            reader.onerror = function(e) {
                console.error("Error while reading the file: ", e);
            }
            reader.readAsText(file);
    }
    function saveFile(){
        const fileContent = JSON.stringify(Data);
        const blob = new Blob([fileContent], {type: 'application/json'});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "myWallet.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



    return (
        <Container className='screen-size flexy'>
            <Header updateFile={updateFile} saveFile={saveFile}/>
            {
                Data === null ? '' :
                    <SplitPane minSize={30} maxSize={70} defaultSize={40}>
                        <NavTab data={Data} updateData={updateData} />
                        <SplitPane horizontal={true}>
                            <ValuesChart data={Data} />
                            <IncomeChart data={Data} />
                        </SplitPane>
                    </SplitPane>
            }
        </Container>
    );
}

export default App;