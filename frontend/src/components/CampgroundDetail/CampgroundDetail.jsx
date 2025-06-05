import "./CampgroundDetail.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";

import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import CampgroundCard from "./CampgroundCard/CampgroundCard";
import CampgroundReviewsList from "./CampgroundReviewsList/CampgroundReviewsList";
import InteractiveReviewForm from "../InteractiveReviewForm/InteractiveReviewForm";
import NewlyAddedCamps from "../NewlyAddedCamps/NewlyAddedCamps";
import NotFound from "../NotFound/NotFound";
import Modal from "../Modal/Modal";

const CampgroundDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [campground, setCampground] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [viewState, setViewState] = useState({
        showReviews: false,
        showReviewForm: false,
    });

    const toggleView = (viewType) => {
        setViewState((prevState) => ({
            ...prevState,
            showReviews:
                viewType === "reviews" ? !prevState.showReviews : false,
            showReviewForm:
                viewType === "form" ? !prevState.showReviewForm : false,
        }));
    };

    const fetchCampground = async () => {
        try {
            const res = await api.get(`/campgrounds/${id}`);
            setCampground(res.data);
        } catch (err) {
            console.error("Error fetching campground:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampground();
    }, [id]);

    const hasShownToast = useRef(false);
    useEffect(() => {
        if (location.state?.message && !hasShownToast.current) {
            toast[location.state.type](location.state.message, {
                autoClose: 3000,
            });
            hasShownToast.current = true;
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const reviews = campground?.reviews || [];
    const avgCampReview =
        reviews.length > 0
            ? Math.round(
                  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              )
            : null;

    const handleDelete = async () => {
        try {
            const res = await api.delete(`/campgrounds/${campground._id}`);
            console.log("Deleted:", res.data);

            navigate("/campgrounds", {
                state: {
                    message: "Campground deleted successfully.",
                    type: "success",
                },
            });
        } catch (err) {
            console.error("Error deleting campground:", err);
            toast.error("Failed to delete campground.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!campground) return <NotFound />;

    return (
        <>
            <div className="CampgroundDetail ms-2 me-2">
                <div>
                    <CampgroundCard
                        campground={campground}
                        avgCampReview={avgCampReview}
                        onEdit={() =>
                            navigate(`/campgrounds/${campground._id}/edit`)
                        }
                        onDelete={() => setShowDeleteModal(true)}
                        onToggleReviews={() => toggleView("reviews")}
                        onToggleReviewForm={() => toggleView("form")}
                        showReviews={viewState.showReviews}
                        showReviewForm={viewState.showReviewForm}
                    />
                </div>

                <div>
                    {viewState.showReviewForm && (
                        <Modal
                            show={viewState.showReviewForm}
                            onClose={() =>
                                setViewState((prev) => ({
                                    ...prev,
                                    showReviewForm: false,
                                }))
                            }
                        >
                            <InteractiveReviewForm
                                campgroundId={campground._id}
                                campgroundTitle={campground.title}
                                reviews={reviews}
                                onReviewAdded={() => {
                                    fetchCampground();
                                    setViewState((prev) => ({
                                        ...prev,
                                        showReviewForm: false,
                                    }));
                                }}
                            />
                        </Modal>
                    )}
                    {viewState.showReviews && (
                        <Modal
                            show={viewState.showReviews}
                            onClose={() =>
                                setViewState((prev) => ({
                                    ...prev,
                                    showReviews: false,
                                }))
                            }
                        >
                            <CampgroundReviewsList
                                initialReviews={reviews}
                                campground={campground}
                                refreshCampground={fetchCampground}
                            />
                        </Modal>
                    )}
                </div>

                <ConfirmationModal
                    show={showDeleteModal}
                    message="Are you sure you want to delete this campground? This action cannot be undone."
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                />
            </div>
            {/* Newly Added Camps */}
            <NewlyAddedCamps limit={9} title={"Explore More"} />
        </>
    );
};

export default CampgroundDetail;
