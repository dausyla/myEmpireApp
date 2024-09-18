import React, {useState} from 'react';

/* 
List of Rows: 
l = [[a,b,c],
     [d,e,f],
     [g,i,h]]
So: l[2][1] == i
*/

export function Table(content, {className = '', topClass = '', leftClass = '', itemClass = '', topLeftClass = ''} = {}) {
    const nbRow = content.length;
    const nbCol = nbRow > 0 ? content[0].length : 0;

    // Handle empty table
    if (nbRow === 0 || nbCol === 0) {
        return <div class={"table-container " + className}>
        </div>
    }

    const [activeItem, setActiveItem] = useState([-1,-1]);
    const [hoverItem, setHoverItem] = useState([-1,-1]);
    function isHover(i, j){
        if (hoverItem[1] === 0){
            return j === 0 && hoverItem[0] === i; 
        }
        if (hoverItem[0] === 0){
            return i === 0 && hoverItem[1] === j; 
        }
        return hoverItem[0] === i && hoverItem[1] >= j || hoverItem[1] === j && hoverItem[0] >= i;
    }

    function buildTopRow() {
        return (
            <thead>
                <tr>
                    {content[0].map((header, i) =>
                        <th className={ (i === 0 ? topLeftClass + ' table-top-left' : topClass) }
                        status={ isHover(0, i) ? 'hover' : '' } 
                        onMouseOver={() => setHoverItem([0, i])}
                        key={'header-' + i}>
                            {header}
                        </th>)}
                </tr>
            </thead>
        )
    }

    function buildOtherRows() {
        const rows = [];
        for (let i = 1; i < content.length; i++) {
            const row = content[i];
            rows.push(
                <tr key={i}>
                    {row.map((item, j) => j === 0 ? // if it's the far left column
                        <th className={leftClass} key={j}
                        status={ isHover(i,j) ? 'hover' : '' } 
                        onMouseOver={() => setHoverItem([i, j])}>
                            {item}
                        </th> : // otherwise (normal item)
                        <td className={itemClass} key={j}
                        status={ isHover(i,j) ? 'hover' : '' }
                        onMouseOver={() => setHoverItem([i, j])}> {/* if it's on the same col/row */}
                            {item}
                        </td>)}
                </tr>
            );
        }
        return <tbody>
            {rows}
        </tbody>
    }

    const topRow = buildTopRow();
    const otherRows = buildOtherRows();

    return (
        <div className={"table-container " + className} onMouseLeave={() => setHoverItem([-1,-1])}>
            <table>
                {topRow}
                {otherRows}
            </table>
        </div>

    )
}