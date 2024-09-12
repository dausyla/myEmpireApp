import React, {useState} from 'react';

function Folder() {
    const [isOpen, setIsOpen] = useState(false);

    // Function that switch isOpen value.
    function toggleOpen(){
        setIsOpen(!isOpen);
    }

    return (
        <div className="container">
            <h1>Hierarchy</h1>
        </div>
    );
}

export default Folder;