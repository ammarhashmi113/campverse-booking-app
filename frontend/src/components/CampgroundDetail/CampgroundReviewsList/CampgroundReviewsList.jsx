import { useEffect, useState } from "react";
import StarRating from "../../StarRating/StarRating";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import api from "../../../api/axiosConfig";
import { useUser } from "../../../contexts/userContext";

const CampgroundReviewsList = ({
    initialReviews,
    campground,
    refreshCampground,
}) => {
    const { user } = useUser(); // Getting user from userContext
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to show/hide the delete confirmation modal
    const [reviews, setReviews] = useState(initialReviews);
    const [deletingReview, setDeletingReview] = useState(null); // Store the review  to delete
    const [isDeleting, setIsDeleting] = useState(false);

    // Use useEffect to update reviews when initialReviews changes
    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]); // This effect runs when initialReviews prop changes

    const handleDeleteReview = async () => {
        try {
            const res = await api.delete(
                `campgrounds/${campground._id}/reviews/${deletingReview._id}`
            );
            console.log("Deleted:", res.data);
            setReviews((prev) =>
                prev.filter((r) => r._id !== deletingReview._id)
            );
            setShowDeleteModal(false);
            refreshCampground(); // This will update avg rating
        } catch (err) {
            console.error("Error deleting review:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="card shadow-lg h-100"
            style={{
                minHeight: "100%",
                maxHeight: "400px",
                overflowY: "auto",
            }}
        >
            <div className="card-body CampgroundReviewsList">
                <h5 className="card-title text-muted text-center">
                    {`${reviews.length} Review${reviews.length > 1 ? "s" : ""}`}
                </h5>
                {reviews.length ? (
                    <div className="d-flex flex-column-reverse">
                        {reviews.map((review) => (
                            <div
                                className="border p-3 mb-3 rounded-3"
                                key={review._id}
                            >
                                <p>{review.text}</p>

                                <div className="d-flex justify-content-between align-items-stretch">
                                    {/* Star Rating (Same Height as Form) */}
                                    <div className="d-flex align-items-center">
                                        {/* Calling StarRating component with rating as prop*/}
                                        <StarRating rating={review.rating} />
                                        {console.log(JSON.stringify(review))}
                                    </div>
                                    <h6 className="text-muted mb-0 mt-1">
                                        by - {review.author.username}
                                    </h6>
                                </div>
                                <div className="d-flex justify-content-end">
                                    {user &&
                                        user._id === review.author._id &&
                                        user._id !== campground.owner._id && (
                                            <button
                                                onClick={() => {
                                                    setShowDeleteModal(true); // Show the confirmation modal
                                                    setDeletingReview(review); // Save WHICH review to delete
                                                }}
                                                className="btn btn-danger mt-2"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#reviewForm"
                                            >
                                                {isDeleting
                                                    ? "Deleting..."
                                                    : "Delete Review"}
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h6 className="text-muted mt-5">No reviews yet.</h6>
                )}
            </div>
            {/* The Campground Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                message="Are you sure you want to delete this review? This action cannot be undone."
                onCancel={() => setShowDeleteModal(false)} // Close the modal
                onConfirm={handleDeleteReview} // Handle the delete action
            />
        </div>
    );
};

export default CampgroundReviewsList;
