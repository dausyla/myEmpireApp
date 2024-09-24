import React, {useRef, useState, useEffect} from 'react';

function removeSpaces(str){
    return str.replace(/ /g, '');
}

function addSpaces(str){
    const minus = str.length > 0 && str[0] === '-' ? '-' : ''
    const start = minus.length
    let nbWholeDigit = 0;
    for (let i = start; i < str.length && str[i] !== '.'; i++){
        nbWholeDigit++;
    }
    const mod = nbWholeDigit % 3;
    let res = minus;
    for (let i = 0; i < nbWholeDigit; i++){
        res += i !== 0 && i % 3 === mod ? ' ' + str[i + start] : str[i + start]
    }
    return res + str.slice(start + nbWholeDigit);
}

function getCarretRealPos(str, carretPos){
    let res = carretPos;
    for (let i = 0; i < carretPos; i++){
        if (str[i] === ' '){
            res--;
        }
    }
    return res;
}

function testKey(base, newKey, pos){
    const noSpace = removeSpaces(base);
    const index = getCarretRealPos(noSpace, pos);
    const res = noSpace.slice(0, index) + newKey + noSpace.slice(index);
    const regex = /^-?\d*[\.,]?\d*$/g
    return regex.test(res);
}

function fixZerosAndComas(str){
    const dots = str.replace(',', '.');
    // If it's >= 1 or <= -1, no needs to have a zero before the dot
    if (/^-?0*[1-9]\d*(\.\d*)?$/.test(dots)) {
        return dots.replace(/^(-?)0*([1-9].*)$/, "$1$2");
    }
    return dots.replace(/^(-?)0*([1-9\.].*)$/, "$10$2");
}

function fixMinus(str) {
    if (str.length === 0) {
        return '0';
    }
    if (str[0] === '-') {
        if (str.length === 1 || str[1] === '.') {
            return '-0' + str.slice(1);
        }
    }
    if (str[0] === '.') {
        return '0' + str;
    }
    return str;
}

function getMinWidth(value){
    const size = value.length / 2;
    return `${(size > 4 ? size : 4) + 1}rem`
}

export function EurInput(value, valueChanged, key, suffix='\xa0€\xa0') {
    function onKeyDown(event) {
        const keyCode = event.keyCode;
        const key = event.key;
        const carretPos = event.target.selectionStart;
        const currentValue = event.target.value;

        const inputs = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // digits
            96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // digipad
            188, 189, 190]; // , - .
        const arrows = [37, 38, 39, 40]; // left top right bottom
        const others = [8, 9, 13, 27, 46, 35, 36]; // Backspace, Tab, Enter, Escape, Suppr, Start, End

        if (arrows.includes(keyCode)) {
            return;
        } else if (inputs.includes(keyCode) && testKey(currentValue, key, carretPos)) {
            return;
        } else if (others.includes(keyCode)) {
            return;
        }

        // If here => wrong key
        if (event.preventDefault) {
            event.preventDefault(); //normal browsers
        }
        event.returnValue = false; //IE
    }
    function onChange(event) {
        const noSpace = removeSpaces(event.target.value)
        const zeroFixed = fixZerosAndComas(noSpace);
        const minusFix = fixMinus(zeroFixed);
        valueChanged(parseFloat(minusFix));
        event.target.value = addSpaces(zeroFixed);
        event.target.style.minWidth = getMinWidth(event.target.value);
    }

    const defaultValue = addSpaces('' + value);

    const inputStyle ={
        minWidth: getMinWidth(defaultValue)
    }

    return <div className='flex justify-right align-center' key={key}>
        {<input style={inputStyle} onKeyDown={onKeyDown} onChange={onChange} defaultValue={defaultValue} className='text-right'></input>}
        {suffix}
    </div>
}

export function NaturalInput(value, valueChanged, key) {
    function onKeyDown(event) {
        const keyCode = event.keyCode;

        const digits = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // digits
        const arrows = [37, 38, 39, 40]; // left top right bottom
        const others = [8, 9, 13, 27, 46, 35, 36]; // Backspace, Tab, Enter, Escape, Suppr, Start, End

        if (digits.includes(keyCode) || arrows.includes(keyCode) || others.includes(keyCode)) {
            return;
        }

        // If here => wrong key
        if (event.preventDefault) {
            event.preventDefault(); //normal browsers
        }
        event.returnValue = false; //IE
    }
    function onChange(event) {
        const zeroFixed = fixZerosAndComas(event.target.value);
        valueChanged(parseInt(zeroFixed));
        event.target.value = zeroFixed;
    }

    return <div className='' key={key}>
        {<input onKeyDown={onKeyDown} onChange={onChange} defaultValue={value} className='text-right'></input>}
    </div>
}


export function RenamableName(product, renamingProduct, setRenamingProduct, updateData){
    function submit(event){
        const input = document.getElementById(product.id + '-rename');
        if (input.value.length !== 0){
            product.name = input.value;
            updateData();
            setRenamingProduct(-1);
        }
        event.preventDefault();
    }

    if (product.id === renamingProduct) {
        return <form onSubmit={submit}><input id={product.id + '-rename'} className='renaming-input'
        defaultValue={product.name} autoFocus/></form>
    }
    else {
        return <div onDoubleClick={() => setRenamingProduct(product.id)}>{product.name}</div>;
    }
}