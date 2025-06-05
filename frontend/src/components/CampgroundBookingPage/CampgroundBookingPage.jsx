import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../../contexts/userContext";
import api from "../../api/axiosConfig";

const CampgroundBookingPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [canBook, setCanBook] = useState(null);
    const [campground, setCampground] = useState(null);
    const { id: campgroundId } = useParams();
    const user = useUser();
    const navigate = useNavigate();

    const fetchCampground = async () => {
        try {
            const res = await api.get(`/campgrounds/${campgroundId}`);
            setCampground(res.data);
        } catch (err) {
            console.error("Error fetching campground:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampground();
    }, [campgroundId]);

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
            setMessage(
                `Booking request sent successfully, see details in "My Requests" section`
            );
            setStartDate(null);
            setEndDate(null);
            navigate("/outgoing-requests");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center g-4">
                {/* Campground Preview */}
                {campground && (
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <img
                                src={
                                    campground?.image ||
                                    "/images/default-camp-image.png"
                                }
                                alt={campground.title}
                                className="card-img-top"
                                style={{
                                    maxHeight: "300px",
                                    objectFit: "cover",
                                }}
                            />
                            <div className="card-body">
                                <h4 className="card-title">
                                    {campground.title}
                                </h4>
                                <p className="card-text text-muted mb-1">
                                    {campground.location}
                                </p>
                                <p className="mb-0">
                                    <strong>Price:</strong> ${campground.price}{" "}
                                    / night
                                </p>
                                <p className="text-muted small mt-2">
                                    {campground.description?.slice(0, 100)}...
                                </p>
                                <h4 className="mt-5 mb-4 text-center">
                                    Book This Camp
                                </h4>
                                <form onSubmit={handleBooking}>
                                    <div className="row mb-3">
                                        <div className="col-md-6 d-flex flex-column">
                                            <label className="form-label fw-medium mb-2 text-center">
                                                Start Date
                                            </label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) =>
                                                    setStartDate(date)
                                                }
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={new Date()}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 d-flex flex-column mt-3 mt-md-0">
                                            <label className="form-label fw-medium mb-2 text-center">
                                                End Date
                                            </label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) =>
                                                    setEndDate(date)
                                                }
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={
                                                    startDate || new Date()
                                                }
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Booking..."
                                            : "Confirm Booking"}
                                    </button>

                                    {message && (
                                        <div className="alert alert-success mt-3">
                                            {message}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger mt-3">
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampgroundBookingPage;
