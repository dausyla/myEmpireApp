import React, { useState, useRef} from 'react';
import NavTab from './NavTab/NavTab';
import IncomeChart from './ChartComponents/IncomeChart';
import ValuesChart from './ChartComponents/ValuesChart';
import SplitPane from './SplitPane';

function Container({childid, defaultscreen, data, updateData, parentexpand}) {
    const [activeScreen, setActiveScreen] = useState(defaultscreen)
    const [showMenu, setShowMenu] = useState(false);
    const [split, setSplit] = useState('');
    const child1 = useRef(null);
    const child2 = useRef(null);

    function choseScreen(screen){
        setActiveScreen(screen);
        setShowMenu(false);
    }

    function splitContainer(dir) {
        setSplit(dir);
    }

    function expand() {
        if (parentexpand) {
            parentexpand(activeScreen)
        }
    }

    function childExpand(screen) {
        setActiveScreen(screen);
        setSplit('');
        setShowMenu(false);
    }

    const menu = <div className='container-menu flexy'>
        <span className='container-choice' onClick={() => choseScreen('NavTab')}>NavTab</span>
        <span className='container-choice' onClick={() => choseScreen('ValuesChart')}>Values Chart</span>
        <span className='container-choice' onClick={() => choseScreen('IncomeChart')}>Income Chart</span>
        <span className='container-choice' onClick={() => splitContainer('h')}>Split Horizontal</span>
        <span className='container-choice' onClick={() => splitContainer('v')}>Split Vertical</span>
        <span className='container-choice' onClick={expand}>expand</span>
    </div>

    return split === '' ? (
        <div className='full-size relative'>
            <div className='container-btns flex'>
                {showMenu ? menu : ''}
                <button className='container-btn' onClick={() => setShowMenu(!showMenu)}>{showMenu ? '▶' : '◀'}</button>
            </div>
            {activeScreen === 'NavTab' ? <NavTab data={data} updateData={updateData} /> :
                activeScreen === 'ValuesChart' ? <ValuesChart data={data} /> :
                    <IncomeChart data={data} />
            }
        </div>
    ) : (
        <SplitPane horizontal={split === 'h'}>
            <Container defaultscreen={activeScreen} data={data}
                updateData={updateData} parentexpand={childExpand} />
            <Container defaultscreen={activeScreen} data={data}
                updateData={updateData} parentexpand={childExpand} />
        </SplitPane>
    );
}

export default Container;