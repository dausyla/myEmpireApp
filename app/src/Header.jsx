import React, { useState } from 'react';

function Header({updateFile, saveFile}) {

    function filePathChange(event){
        const file = event.target.files[0]
        if (file){
            updateFile(file);
        }
    }

    return (
        <div className='flex'>
            <input type='file' onChange={(filePathChange)}/>
            <button onClick={saveFile}>Save File</button>
        </div>
    );
}

export default Header;