import React, { useState, useRef } from 'react';

function SplitPane(props) {
    const child1 = props.children[0];
    const child2 = props.children[1];

    const isHorizontal = props.horizontal ? true : false;

    const defaultSize = props.defaultSize ? props.defaultSize : 50;
    const minSize = props.minSize ? props.minSize : 10;
    const maxSize = props.maxSize ? props.maxSize : 90;
    const [size, setSize] = useState(defaultSize);

    const isResizing = useRef(false);

    const containerRef = useRef(null);

    const handleMouseDown = () => {
        isResizing.current = true;
    };
    const handleMouseUp = () => {
        isResizing.current = false;
    };
    const handleMouseMove = (e) => {
        if (isResizing.current) {
            if (isHorizontal) {
                const containerHeight = containerRef.current.offsetHeight;
                const newSize = (e.clientY / containerHeight) * 100;
                setSize(Math.max(minSize, Math.min(maxSize, newSize)));
            }
            else {
                const containerWidth = containerRef.current.offsetWidth;
                const newSize = (e.clientX / containerWidth) * 100;
                setSize(Math.max(minSize, Math.min(maxSize, newSize)));
            }
        }
    };

    const wholeClass = `full-size ${isHorizontal ? 'flexy' : 'flex'}`

    const firstStyle = {
        width: isHorizontal ? '100%' : size + '%',
        height: !isHorizontal ? '100%' : size + '%',
    }

    const dividerSize = '0.3rem'
    const dividerStyle = {
        backgroundColor: '#000',
        cursor: isHorizontal ? 'ns-resize' : 'ew-resize',
        width: isHorizontal ? '100%' : dividerSize,
        height: !isHorizontal ? '100%' : dividerSize
    }

    const secondStyle = {
        width: isHorizontal ? '100%' : `calc(${100 - size}% - ${dividerSize})`,
        height: !isHorizontal ? '100%' : `calc(${100 - size}% - ${dividerSize})`
    }

    return (
        <div className={wholeClass} ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div style={firstStyle}>
                {child1}
            </div>
            <div onMouseDown={handleMouseDown} style={dividerStyle}/>
            <div  style={secondStyle}>
                {child2}
            </div>
        </div>
    );
}

export default SplitPane;