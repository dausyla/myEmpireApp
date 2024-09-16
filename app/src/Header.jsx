import React, { useState } from 'react';

function Header(props) {

    function filePathChange(event){
        const file = event.target.files[0]
        if (file){
            props.updateFile(file);
        }
    }

    return (
        <div className='flex'>
            <input type='file' onChange={(filePathChange)}/>
            <button onClick={props.saveFile}>Save File</button>
            <button onClick={props.newRawFile}>New File</button>
        </div>
    );
}

export default Header;