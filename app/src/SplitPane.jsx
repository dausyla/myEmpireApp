import React, { useState, useRef } from 'react';

function toThrottled(func, wait) {
    let lastCall = 0; // Timestamp of the last function call
    let timeout = null; // Timeout identifier for the delayed function call

    return function(...args) {
        const now = Date.now(); // Current timestamp
        const remaining = wait - (now - lastCall); // Time remaining before next allowed call

        // If the remaining time is less than or equal to zero, or no timeout is set
        if (remaining <= 0 || timeout === null) {
            // Clear any existing timeout
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }

            // Execute the function
            func.apply(this, args);
            lastCall = now; // Update the timestamp of the last function call
        } else {
            // Otherwise, set a timeout to call the function after the remaining time
            if (timeout === null) {
                timeout = setTimeout(() => {
                    func.apply(this, args);
                    lastCall = Date.now();
                    timeout = null; // Clear timeout identifier
                }, remaining);
            }
        }
    };
}


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

    const setSizeThrottled = toThrottled(setSize, 500)

    const handleMouseMove = (e) => {
        if (isResizing.current) {
            if (isHorizontal) {
                const containerHeight = containerRef.current.offsetHeight;
                const newSize = (e.clientY / containerHeight) * 100;
                setSizeThrottled(Math.max(minSize, Math.min(maxSize, newSize)))
            }
            else {
                const containerWidth = containerRef.current.offsetWidth;
                const newSize = (e.clientX / containerWidth) * 100;
                setSizeThrottled(Math.max(minSize, Math.min(maxSize, newSize)))
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
        height: !isHorizontal ? '100%' : `calc(${100 - size}% - ${dividerSize})`,
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