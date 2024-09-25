import React from "react";

export function Select(onChange, options, defaultValue){
    let minWidth = -1;
    options.forEach(o => minWidth = minWidth > o.name.length/2 ? minWidth : o.name.length/2);
    minWidth += 3
    return <select defaultValue={defaultValue} onChange={onChange} style={{minWidth: minWidth + 'rem'}}>
        {options.map(o => <option key={'select-' + o.id} value={o.id}>{o.name}</option>)}
    </select>
}