import React, {useState} from 'react';

function strFromFloat(n){
    const str = `${n}`;
    const nbWholeDigit = `${Math.floor(n)}`.length;
    const mod = nbWholeDigit % 3;
    let res = '';
    for (let i = 0; i < nbWholeDigit; i++){
        res += i !== 0 && i % 3 === mod ? ' ' + str[i] : str[i]
    }
    return res;
}

export function EurInput(value, valueChanged, key){
    function onKeyDown(event) {
        // TODO
        return;
    }
    function onChange(event) {
        // TODO
        valueChanged(event.target.value)
    }

    return <div className='flex justify-right' key={key}>
        { <input onKeyDown={onKeyDown} onChange={onChange} defaultValue={value}></input> }
        &nbsp;€
    </div>
}