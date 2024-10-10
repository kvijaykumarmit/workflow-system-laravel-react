import React from 'react';
import { Button } from 'react-bootstrap';
import './WindowComponent.css';

const WindowComponent = ({ show, handleClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="custom-window">
            <div className="window-header">
                <h5>{title}</h5>
                <Button variant="close" onClick={handleClose} />
            </div>
            <div className="window-body">
                {children}
            </div>
        </div>
    );
};

export default WindowComponent;
