import React, { useState } from 'react';

function Header(props) {

    function filePathChange(event){
        const file = event.target.files[0]
        if (file){
            props.updateFile(file);
        }
    }

    return (
        <div className='flex header'>
            <input type='file' onChange={(filePathChange)} />
            <button className='' onClick={props.saveFile}> Save File </button>
            <button className='' onClick={props.newRawFile}> New File </button>
        </div>
    );
}

export default Header;