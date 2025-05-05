import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import CampgroundCard from "./CampgroundCard/CampgroundCard";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { toast, ToastContainer } from "react-toastify";
import CampgroundListLoadingSkeleton from "../CampgroundListLoadingSkeleton/CampgroundListLoadingSkeleton";

function Campgrounds({ apiPath, title, userLoading }) {
    const { user } = useUser();
    const [campgrounds, setCampgrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = "Campverse - Explore";
    }, []);

    useEffect(() => {
        if (!userLoading && apiPath === "/campgrounds/me" && !user) {
            navigate("/login", {
                replace: true,
                state: {
                    message: "Please login to see your campgrounds.",
                    type: "info",
                },
            });
        } else {
            const fetchCampgrounds = async () => {
                setLoading(true);
                try {
                    const res = await api.get(
                        `${apiPath}?page=${currentPage}&limit=10`
                    );
                    setCampgrounds(res.data.campgrounds);
                    setTotalPages(res.data.totalPages);
                } catch (err) {
                    console.error("Error fetching campgrounds:", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchCampgrounds();

            if (location.state?.message) {
                const { message, type } = location.state;
                toast[type](message, {
                    autoClose: 3000,
                });
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [userLoading, apiPath, user, navigate, location.state, currentPage]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [currentPage]);

    const handleAddNewCampground = () => {
        navigate("/campgrounds/new");
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <ToastContainer style={{ marginTop: "4rem" }} />
            <div className="container mt-4">
                <h1 className="text-center display-4">{title}</h1>

                {(apiPath === "/campgrounds" ||
                    apiPath === "/campgrounds/me") && (
                    <div className="mb-3 mt-4">
                        {user ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <Link
                                    to="/campgrounds/new"
                                    className="btn btn-dark rounded-pill"
                                    onClick={handleAddNewCampground}
                                >
                                    Add New Camp
                                </Link>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">
                                            Join the adventure!
                                        </h5>
                                        <p className="card-text">
                                            Sign up or log in to add your own
                                            campgrounds, leave reviews, and book
                                            your next trip.
                                        </p>
                                        <div className="d-flex justify-content-center gap-2">
                                            <a
                                                href="/register"
                                                className="btn btn-primary rounded-pill"
                                            >
                                                Sign Up
                                            </a>
                                            <a
                                                href="/login"
                                                className="btn btn-outline-secondary rounded-pill"
                                                style={{ minWidth: "81.64px" }}
                                            >
                                                Log In
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!userLoading && loading ? (
                    <CampgroundListLoadingSkeleton
                        apiPath={apiPath}
                        userLoading={userLoading}
                    />
                ) : campgrounds.length > 0 ? (
                    <>
                        {campgrounds.map((camp, index) => (
                            <CampgroundCard
                                key={`${camp._id}-${index}`}
                                campground={camp}
                            />
                        ))}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-4 mb-4 gap-2 flex-wrap">
                                <button
                                    className="btn btn-dark rounded-circle"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &#8592;
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-dark rounded-circle"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    &#8594;
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>No campgrounds found.</p>
                )}
            </div>
        </>
    );
}

export default Campgrounds;
