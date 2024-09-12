import React, { useState } from 'react';
import Hierarchy from './Hierarchy';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import EditValues from './EditValues';
import EditIncome from './EditIncome';

function NavTab(props) {
    const [activeTab, setActiveTab] = useState('hierarchy');
    return (
        <Container>
            <Nav tabs className='custom-nav'>
                <NavItem>
                    <NavLink className={activeTab == 'hierarchy' ? 'active' : ''} onClick={() => setActiveTab('hierarchy')}>
                        Hierachy
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == 'values' ? 'active' : ''} onClick={() => setActiveTab('values')}>
                        Values
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={activeTab == 'income' ? 'active' : ''} onClick={() => setActiveTab('income')}>
                        Income
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="hierarchy">
                    <Hierarchy data={props.data} updateProduct={props.updateProduct} updateWholeData={props.updateWholeData} />
                </TabPane>
                <TabPane tabId="values">
                    <EditValues data={props.data} updateProduct={props.updateProduct} updateWholeData={props.updateWholeData}/>
                </TabPane>
                <TabPane tabId="income">
                    <EditIncome data={props.data} updateProduct={props.updateProduct}/>
                </TabPane>
            </TabContent>
        </Container>
    );
}

export default NavTab;