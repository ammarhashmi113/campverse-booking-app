import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosConfig";
import { useUser } from "../../../contexts/userContext";
import BookingCard from "../BookingCard/BookingCard";

function IncomingRequests({ userLoading }) {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [processedBookings, setProcessedBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const user = useUser();

    // if (!userLoading && !user.user) {
    //     navigate("/login", {
    //         replace: true,
    //         state: {
    //             message: "Please login to see incoming booking requests.",
    //             type: "info",
    //         },
    //     });
    // }

    const fetchBookings = async () => {
        try {
            const bookings = await api.get("/bookings");

            const pending = bookings.data.filter((b) => b.status === "pending");
            const processed = bookings.data.filter(
                (b) => b.status !== "pending"
            );

            setPendingBookings(pending);
            setProcessedBookings(processed);
        } catch (err) {
            console.error("An error occurred", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userLoading && !user.user) {
            navigate("/login", {
                replace: true,
                state: {
                    message: "Please login to see your bookings.",
                    type: "info",
                },
            });
        } else if (!userLoading && user) {
            fetchBookings();
        }
    }, [userLoading, user, navigate]);

    return (
        <div className="mt-4">
            <h1 className="text-center display-4">Booking Requests</h1>

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Pending Bookings */}
            {!loading && (
                <>
                    <h2 className="text-center mt-5">Pending</h2>
                    {pendingBookings.length > 0 ? (
                        pendingBookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                refreshBookings={fetchBookings}
                            />
                        ))
                    ) : (
                        <div className="alert alert-info text-center m-4">
                            No pending booking requests.
                        </div>
                    )}
                </>
            )}

            {/* Processed Bookings */}
            {!loading && (
                <>
                    <h2 className="text-center mt-5">Processed</h2>
                    {processedBookings.length > 0 ? (
                        processedBookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                refreshBookings={fetchBookings}
                            />
                        ))
                    ) : (
                        <div className="alert alert-secondary text-center mt-3">
                            No processed bookings yet.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default IncomingRequests;
