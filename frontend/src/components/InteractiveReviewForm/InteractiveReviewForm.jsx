import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import "./InteractiveReviewForm.css";
import { useUser } from "../../contexts/userContext";

const InteractiveReviewForm = ({
    campgroundId,
    campgroundTitle,
    reviews,
    onReviewAdded,
}) => {
    const { user } = useUser(); // Getting user from userContext
    const [text, setText] = useState(""); // Review text
    const [rating, setRating] = useState(0); // Rating value (default to 0)
    const [loading, setLoading] = useState(false); // Loading state while submitting
    const [alreadyReviewed, setAlreadyReviewed] = useState(false); // Check if the user already reviewed
    const [isValid, setIsValid] = useState(true); // Form validation

    useEffect(() => {
        if (reviews && user) {
            // Check if user has already reviewed the campground
            const hasReviewed = reviews.some(
                (review) => review.author._id === user._id
            );
            setAlreadyReviewed(hasReviewed);
        }
    }, [reviews, user]);

    const handleRatingChange = (e) => {
        setRating(Number(e.target.value)); // Update the selected rating
    };

    const handleTextChange = (e) => {
        setText(e.target.value); // Update the review text
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form (both rating and text are required)
        if (!rating || !text.trim()) {
            setIsValid(false);
            return;
        }

        try {
            setLoading(true);
            // API call to post the review
            await api.post(`/campgrounds/${campgroundId}/reviews`, {
                review: {
                    text,
                    rating,
                },
            });
            setText(""); // Clear the text input after submission
            setRating(5); // Reset the rating to 5
            onReviewAdded(); // Callback to refresh the reviews
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    if (alreadyReviewed) {
        // Show message if the user has already reviewed
        return (
            <div className="alert alert-warning mt-3 collapse show">
                You've already reviewed this campground.
            </div>
        );
    }

    return (
        <div className="container">
            <div className="rating-container text-center">
                <div className="rating-emoji">😊</div>
                <h3 className="rating-title">
                    How was your experience with {campgroundTitle}?
                </h3>
                <div className="star-rating">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <React.Fragment key={star}>
                            <input
                                type="radio"
                                id={`star${star}`}
                                name="rating"
                                value={star}
                                required
                                checked={rating === star}
                                onChange={handleRatingChange}
                            />
                            <label
                                htmlFor={`star${star}`}
                                className="fas fa-star"
                            ></label>
                        </React.Fragment>
                    ))}
                </div>

                <div className="rating-feedback">
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tell us about your experience (required)"
                        value={text}
                        onChange={handleTextChange}
                        required
                    ></textarea>
                    {!isValid && (
                        <div className="invalid-feedback">
                            Please provide both a rating and a review.
                        </div>
                    )}
                </div>

                <button
                    className="submit-rating"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Rating"}
                </button>
            </div>
        </div>
    );
};

export default InteractiveReviewForm;
