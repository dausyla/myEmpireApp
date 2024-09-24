import React, {useRef, useState, useEffect} from 'react';

function fixValue(value){
    return Math.round(value * 100) / 100;
}

export function NumberLabel(prefix, value, suffix){
    const posColor = '#aaffaa';
    const negColor = '#ffaaaa';
    return <div className='flex full-size flex-nowrap align-center'>
        {prefix}
        <div className='margin-left-auto flex-nowrap align-center' style={{color: value > 0 ? posColor : value < 0 ? negColor : 'white'}}>
            {value >= 0 ? '+' : ''}{fixValue(value)}{suffix}
        </div>
    </div>
}