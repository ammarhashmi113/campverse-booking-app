// src/components/CampgroundDetail/CampgroundCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../../StarRating/StarRating";
import { useUser } from "../../../contexts/userContext";
import api from "../../../api/axiosConfig"; // axiosConfig sets base url and adds an interceptor to add the JWT token to every request

const CampgroundCard = ({
    campground,
    avgCampReview,
    onEdit,
    onDelete,
    onToggleReviews,
    onToggleReviewForm,
    showReviews,
    showReviewForm,
}) => {
    const { user } = useUser(); // Getting user from userContext
    const [canReview, setCanReview] = useState(false);
    const [canBook, setCanBook] = useState(false);

    useEffect(() => {
        const setCanReviewAndBook = async () => {
            try {
                const canReviewRes = await api.get(
                    `/campgrounds/${campground._id}/can-review`
                );

                const canBookRes = await api.get(
                    `/campgrounds/${campground._id}/can-book`
                );

                setCanReview(canReviewRes.data.canReview);
                setCanBook(canBookRes.data.canBook);
            } catch (err) {
                console.error(
                    "Failed to check review and/or booking permissions:",
                    err
                );
            }
        };

        if (user) setCanReviewAndBook();
    }, [user, campground._id]);

    return (
        <div className="card shadow border-0 w-100 h-100 rounded-4">
            <img
                src={campground.image}
                className="card-img-top img-fluid"
                alt="Campground"
                style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <div className="card-body">
                <h1 className="card-title">{campground.title}</h1>
                <p className="text-muted">{campground.location}</p>
                <p className="text-muted">{campground.author}</p>
                <p className="card-text">{campground.description}</p>

                <div className="d-flex justify-content-between">
                    <div>
                        <h5 className="card-text">${campground.price}/night</h5>
                        <StarRating rating={avgCampReview} />

                        <button
                            className="btn btn-info mt-2 me-2 rounded-pill"
                            onClick={onToggleReviews}
                        >
                            {showReviews ? "Hide Reviews" : "Show Reviews"}
                        </button>

                        <button
                            className="btn btn-success mt-2 me-2 rounded-pill"
                            onClick={onToggleReviewForm}
                            disabled={!canReview}
                            style={
                                !canBook
                                    ? {
                                          opacity: "0.5",
                                      }
                                    : {}
                            }
                        >
                            {showReviewForm ? "Hide Review Form" : "Add Review"}
                        </button>

                        <form
                            action={
                                canBook
                                    ? `/campgrounds/${campground._id}/book`
                                    : "#"
                            }
                            method="GET"
                            onSubmit={(e) => {
                                if (!canBook) {
                                    e.preventDefault(); // Prevent form submission if `canBook` is false
                                }
                            }}
                        >
                            <button
                                type="submit"
                                className="btn btn-warning mt-2 me-2 rounded-pill"
                                disabled={!canBook}
                                style={
                                    !canBook
                                        ? {
                                              opacity: "0.5",
                                          }
                                        : {}
                                }
                            >
                                Book
                            </button>
                        </form>
                        <div className="mt-2">
                            <Link to="/campgrounds">
                                <button
                                    className="btn btn-light mt-2 me-2 rounded-pill"
                                    style={{ display: "inline-block" }}
                                >
                                    All Campgrounds
                                </button>
                            </Link>
                        </div>
                    </div>

                    {!(
                        user?._id?.toString?.() ===
                        campground?.owner?._id?.toString?.()
                    ) && (
                        <div
                            className="d-flex flex-row justify-content-end"
                            style={{ width: "18rem" }}
                        >
                            <div className="d-flex flex-column justify-content-end">
                                <div className="card text-center">
                                    <div className="card-header bg-info text-white">
                                        Campground By
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            {campground.owner.username}
                                        </li>
                                    </ul>
                                    <div className="card-header bg-info text-white">
                                        Date Added
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            {new Date(
                                                campground.createdAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {user?._id?.toString?.() ===
                        campground?.owner?._id?.toString?.() && (
                        <div className="d-flex flex-column justify-content-end">
                            <div className="d-flex flex-row">
                                <button
                                    onClick={onEdit}
                                    className="btn btn-primary mt-2 me-2 rounded-pill"
                                    style={{ minWidth: "71.63px" }}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={onDelete}
                                    className="btn btn-danger mt-2 rounded-pill"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampgroundCard;
