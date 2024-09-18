import React, { useState, useRef} from 'react';
import Header from './Header';
import NavTab from './NavTab/NavTab';
import ValuesChart from './ChartComponents/ValuesChart';
import IncomeChart from './ChartComponents/IncomeChart';
import Container from './Container';
import { fakeData } from './Data';
import { Table } from './Utils/Table';
import SplitPane from './SplitPane';

function makeDataVisible(data) {
    for (let i in data.products) {
        data.products[i].visible = true;
    }
}

function App() {
    const [Data, SetData] = useState(fakeData);
    function updateData(){
        // Create a whole new object
        const newData = JSON.parse(JSON.stringify(Data));
        SetData(newData);
    }

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
    function newRawFile(){
        SetData({
            valuesDates:[],
            products: [],
        })
    }

    return (
        <div className='screen-size flexy'>
            <Header updateFile={updateFile} saveFile={saveFile} newRawFile={newRawFile}/>
            <div className='flex-grow overflow-hidden'>
            {
                Data === null ? '' :
                    <SplitPane minSize={30} maxSize={70} defaultSize={40}>
                        <Container defaultscreen="NavTab" data={Data} updateData={updateData} />
                        <SplitPane horizontal={true}>
                            <Container defaultscreen="ValuesChart" data={Data} updateData={updateData} />
                            <Container defaultscreen="IncomeChart" data={Data} updateData={updateData} />
                        </SplitPane>
                    </SplitPane>
            }
            </div>
        </div>
    );
}

export default App;