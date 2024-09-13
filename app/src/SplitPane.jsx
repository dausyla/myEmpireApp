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

    const dividerSize = '0.3rem';
    const dividerStyle = {
        backgroundColor: '#000',
        cursor: isHorizontal ? 'ns-resize' : 'ew-resize',
        zIndex: 1,
        width: isHorizontal ? '100%' : dividerSize,
        height: !isHorizontal ? '100%' : dividerSize
    }

    return (
        <div
            className="split-pane-container"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
                display: 'flex', flexDirection: isHorizontal ? 'column' : 'row',
                height: '100%', width: '100%'
            }}
        >
            <div style={{
                width: isHorizontal ? '100%' : `calc(${size}% - ${dividerSize})`,
                height: !isHorizontal ? '100%' : `calc(${size}% - ${dividerSize})`,
                padding:0, boxSizing: 'border-box'
            }}>
                {child1}
            </div>
            <div
                className="divider"
                onMouseDown={handleMouseDown}
                style={dividerStyle}
            />
            <div style={{
                width: isHorizontal ? '100%' : `${100 - size}%`,
                height: !isHorizontal ? '100%' : `${100 - size}%`,
                padding:0, boxSizing: 'border-box'
            }}>
                {child2}
            </div>
        </div>
    );
}

export default SplitPane;