import { useState, useEffect } from "react";
import api from "../../../api/axiosConfig";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";

function BookingCard({ booking, refreshBookings, readOnly = false }) {
    const [showDeclineForm, setShowDeclineForm] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [declineFormSubmitEvent, setDeclineFormSubmitEvent] = useState(null);

    const handleAccept = async () => {
        try {
            const campgroundId = booking.campground._id;
            const bookingId = booking._id;
            await api.patch(
                `/campgrounds/${campgroundId}/booking/${bookingId}`,
                {
                    status: "accepted",
                }
            );
            setShowAcceptModal(false);
            toast.success("Booking accepted successfully");
            refreshBookings();
        } catch (err) {
            console.error("An error occured", err);
        }
    };

    const handleDeclineClick = () => {
        setShowDeclineForm(true);
    };

    const handleDeclineSubmit = (e) => {
        e.preventDefault();
        setDeclineFormSubmitEvent(e);
        setShowDeclineModal(true);
    };

    const handleDecline = async (e = declineFormSubmitEvent) => {
        if (declineReason.trim().length < 10) {
            toast.error("Reason must be at least 10 characters.");
            return;
        }

        try {
            const campgroundId = booking.campground._id;
            const bookingId = booking._id;

            await api.patch(
                `/campgrounds/${campgroundId}/booking/${bookingId}`,
                {
                    status: "declined",
                    reason: declineReason,
                }
            );
            setShowDeclineModal(false);
            toast.success("Booking declined successfully");
            refreshBookings();
        } catch (err) {
            console.error("An error occured", err);
        }
    };

    // Accept/Decline buttons & form only show if not readOnly and booking is pending
    const showActions =
        booking.status === "pending" && !readOnly && handleAccept;

    return (
        <>
            <div className="card m-4 shadow rounded-4 overflow-hidden">
                <div className="card-body p-4">
                    {/* Title and Status */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title mb-0 fw-bold">
                            {booking.campground.title}
                        </h4>
                        <span
                            className={`badge rounded-pill ${
                                booking.status === "pending"
                                    ? "bg-warning text-dark"
                                    : booking.status === "accepted"
                                    ? "bg-success text-light"
                                    : "bg-danger text-light"
                            } px-3 py-2`}
                        >
                            {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                        </span>
                    </div>

                    {/* Booking Dates */}
                    <div className="mb-4">
                        <p className="mb-2 text-muted small">Booking Dates</p>
                        <div className="d-flex flex-column flex-sm-row gap-3">
                            <span className="badge bg-light text-dark p-2 rounded-pill">
                                Start:{" "}
                                <strong>
                                    {new Date(
                                        booking.startDate
                                    ).toLocaleDateString()}
                                </strong>
                            </span>
                            <span className="badge bg-light text-dark p-2 rounded-pill">
                                End:{" "}
                                <strong>
                                    {new Date(
                                        booking.endDate
                                    ).toLocaleDateString()}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="mb-4">
                        <p className="mb-2 text-muted small">
                            User Information
                        </p>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <i className="bi bi-person-circle me-2"></i>
                                <strong>Username:</strong>{" "}
                                {booking.user?.username || "Unknown User"}
                            </li>
                            <li>
                                <i className="bi bi-envelope me-2"></i>
                                <strong>Email:</strong>{" "}
                                {booking.user?.email || "No email provided"}
                            </li>
                        </ul>
                    </div>

                    {/* Created Date */}
                    <div className="text-muted small mb-4">
                        <i className="bi bi-clock"></i> Created on:{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>

                    {/* Accept/Decline Buttons */}
                    {showActions && !showDeclineForm && (
                        <div className="d-flex gap-3">
                            <button
                                className="btn btn-success flex-grow-1 mw-10"
                                onClick={() => setShowAcceptModal(true)}
                                style={{ maxWidth: "200px" }}
                            >
                                Accept
                            </button>
                            <button
                                className="btn btn-danger flex-grow-1"
                                onClick={handleDeclineClick}
                                style={{ maxWidth: "200px" }}
                            >
                                Decline
                            </button>
                        </div>
                    )}

                    {booking.status === "declined" && booking.reason && (
                        <div>
                            <strong>Reason: </strong>
                            {booking.reason}
                        </div>
                    )}

                    {/* Decline Form */}
                    {showActions && showDeclineForm && (
                        <form onSubmit={handleDeclineSubmit} className="mt-4">
                            <div className="mb-3">
                                <label
                                    htmlFor="declineReason"
                                    className="form-label"
                                >
                                    Reason for Declining (required)
                                </label>
                                <textarea
                                    className="form-control"
                                    id="declineReason"
                                    rows="3"
                                    value={declineReason}
                                    onChange={(e) =>
                                        setDeclineReason(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-danger w-100"
                            >
                                Submit Decline
                            </button>
                        </form>
                    )}
                </div>

                <div className="card-footer bg-light text-muted text-center small py-3">
                    Booking ID: <code>{booking._id}</code>
                </div>
            </div>

            {/* Confirm Modals */}
            {!readOnly && (
                <>
                    <ConfirmationModal
                        show={showDeclineModal}
                        message="Are you sure you want to decline this booking request? This action cannot be undone."
                        onCancel={() => setShowDeclineModal(false)}
                        onConfirm={handleDecline}
                    />
                    <ConfirmationModal
                        show={showAcceptModal}
                        message="Are you sure you want to accept this booking request? This action cannot be undone."
                        onCancel={() => setShowAcceptModal(false)}
                        onConfirm={handleAccept}
                    />
                </>
            )}
        </>
    );
}

export default BookingCard;
