import React from 'react';

/* 
List of Rows: 
l = [[a,b,c],
     [d,e,f],
     [g,i,h]]
So: l[2][1] == i
*/

function buildTopRow(content, topClass, topLeftClass){
    return (
        <thead>
            <tr>
                {content[0].map((header, i) => 
                    <th className={
                        i === 0 ? topLeftClass + ' table-top-left' : topClass
                    }>
                        {header}
                    </th>)}
            </tr>
        </thead>
    )
}

function buildOtherRows(content, leftClass, itemClass) {
    const rows = [];
    for (let i = 1; i < content.length; i++){
        const row = content[i];
        rows.push(
            <tr>
                {row.map((item,i) => i === 0 ? // if it's the far left column
                <th className={leftClass}>{item}</th> : // otherwise (normal item)
                <td className={itemClass}> 
                    {item}
                </td>)}
            </tr>
        );
    }
    return <tbody>
        {rows}
    </tbody>
}

export function Table(content, className = '', topClass = '', leftClass = '', itemClass = '', topLeftClass = '') {
    const nbRow = content.length;
    const nbCol = nbRow > 0 ? content[0].length : 0;

    // Handle empty table
    if (nbRow === 0 || nbCol === 0) {
        return <div class={"table-container " + className}>
        </div>
    }

    const topRow = buildTopRow(content, topClass, topLeftClass);
    const otherRows = buildOtherRows(content, leftClass, itemClass);

    return (
        <div class={"table-container " + className}>
            <table>
                {topRow}
                {otherRows}
                {/* <thead>
                    <tr>
                        <th className={"table-top-left " + topLeftClass}></th>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                        <th>Header 4</th>
                    </tr>
                </thead> */}
                {/* <tbody>
                    <tr>
                        <th>Row 1</th>
                        <td>Data 1.1</td>
                        <td>Data 1.2</td>
                        <td>Data 1.3</td>
                        <td>Data 1.4</td>
                    </tr>
                    <tr>
                        <th>Row 2</th>
                        <td>Data 2.1</td>
                        <td>Data 2.2</td>
                        <td>Data 2.3</td>
                        <td>Data 2.4</td>
                    </tr>
                    <tr>
                        <th>Row 3</th>
                        <td>Data 3.1</td>
                        <td>Data 3.2</td>
                        <td>Data 3.3</td>
                        <td>Data 3.4</td>
                    </tr>
                </tbody> */}
            </table>
        </div>

    )
}