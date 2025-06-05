// src/components/Modal.jsx
import "./Modal.css"; // You can make your own styling here
import React, { useRef, useEffect } from "react";

const Modal = ({ show, onClose, children }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content" ref={modalRef}>
                <div className="custom-modal-body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
