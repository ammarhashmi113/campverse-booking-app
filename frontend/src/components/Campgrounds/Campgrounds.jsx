import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import api from "../../api/axiosConfig";
import { useUser } from "../../contexts/userContext";
import CampgroundCard from "./CampgroundCard/CampgroundCard";
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
            return navigate("/login", {
                replace: true,
                state: {
                    message: "Please login to see your campgrounds.",
                    type: "info",
                },
            });
        }

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
            toast[location.state.type](location.state.message, {
                autoClose: 3000,
            });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [userLoading, apiPath, user, navigate, location, currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => (
        <div className="d-flex justify-content-center align-items-center mt-4 mb-4 gap-3 flex-wrap">
            <button
                className="btn btn-outline-dark rounded-circle"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &#8592;
            </button>
            <span className="fw-semibold">
                Page {currentPage} of {totalPages}
            </span>
            <button
                className="btn btn-outline-dark rounded-circle"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &#8594;
            </button>
        </div>
    );

    const renderAuthCard = () => (
        <div className="mb-4">
            <div className="card border-0 rounded-4 shadow-sm">
                <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Join the Adventure</h5>
                    <p className="card-text">
                        Sign up or log in to host your own campgrounds or book
                        your next trip.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Link
                            to="/register"
                            className="btn btn-primary rounded-pill"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="btn btn-outline-secondary rounded-pill"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <ToastContainer style={{ marginTop: "4rem" }} />
            <div className="container mt-5">
                <h1 className="text-center display-5 fw-bold mb-4">{title}</h1>

                {(apiPath === "/campgrounds" ||
                    apiPath === "/campgrounds/me") &&
                    (user ? (
                        <div className="d-flex justify-content-center mb-4">
                            <Link
                                to="/campgrounds/new"
                                className="btn btn-dark rounded-pill px-4 py-2"
                            >
                                Host Your Camp
                            </Link>
                        </div>
                    ) : (
                        renderAuthCard()
                    ))}

                {loading || userLoading ? (
                    <CampgroundListLoadingSkeleton />
                ) : campgrounds.length > 0 ? (
                    <>
                        <div className="row row-cols-1 g-4">
                            {campgrounds.map((camp, index) => (
                                <div
                                    key={`${camp._id}-${index}`}
                                    className="col"
                                >
                                    <CampgroundCard campground={camp} />
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && renderPagination()}
                    </>
                ) : (
                    <p className="text-center mt-5 text-muted">
                        No campgrounds found.
                    </p>
                )}
            </div>
        </>
    );
}

export default Campgrounds;
