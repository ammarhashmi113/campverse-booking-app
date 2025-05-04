import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../../contexts/userContext";
import api from "../../api/axiosConfig"; // axiosConfig sets base url and adds an interceptor to add the JWT token to every request

const CampgroundBookingPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [canBook, setCanBook] = useState(null);
    const { id: campgroundId } = useParams();
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const checkCanBook = async () => {
            try {
                const canBookRes = await api.get(
                    `/campgrounds/${campgroundId}/can-book`
                );
                setCanBook(canBookRes.data.canBook);
            } catch (err) {
                console.error("Failed to check book permission:", err);
                navigate("/NotFound");
            }
        };

        checkCanBook();
    }, [user, campgroundId]);

    // Navigate when `canBook` is false
    useEffect(() => {
        if (canBook === false) {
            navigate(`/campgrounds/${campgroundId}`, {
                replace: true,
                state: {
                    message: "You are not allowed to book that campground",
                    type: "error",
                },
            });
        }
    }, [canBook, campgroundId, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await api.post(`/campgrounds/${campgroundId}/booking`, {
                booking: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                },
            });
            setMessage("Booking request sent successfully!");
            setStartDate(null);
            setEndDate(null);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleBooking}
            className="mt-3 border p-3 rounded bg-light"
        >
            <h5>Book this Campground</h5>
            <div className="mb-2">
                <label className="form-label">Start Date: </label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-2">
                <label className="form-label">End Date: </label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    className="form-control"
                    required
                />
            </div>
            <button
                type="submit"
                className="btn btn-warning"
                disabled={loading}
            >
                {loading ? "Booking..." : "Confirm Booking"}
            </button>
            {message && <p className="text-success mt-2">{message}</p>}
            {error && <p className="text-danger mt-2">{error}</p>}
        </form>
    );
};

export default CampgroundBookingPage;
