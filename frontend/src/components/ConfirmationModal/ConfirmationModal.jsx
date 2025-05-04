// src/components/ConfirmationModal.jsx
import React from "react";

const ConfirmationModal = ({ show, message, onCancel, onConfirm }) => {
    return (
        show && (
            <div
                className="modal fade show"
                tabIndex="-1"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                aria-labelledby="confirmationModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="confirmationModalLabel"
                            >
                                Confirm Action
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={onCancel}
                            ></button>
                        </div>
                        <div className="modal-body">{message}</div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ConfirmationModal;
