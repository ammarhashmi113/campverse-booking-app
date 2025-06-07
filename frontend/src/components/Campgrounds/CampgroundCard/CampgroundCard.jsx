import "./CampgroundCard.css";
import { Link } from "react-router-dom";
import StarRating from "../../../components/StarRating/StarRating";

const CampgroundCard = ({ campground }) => {
    const reviews = campground.reviews || [];
    const avgCampReview = Math.round(
        reviews.reduce((acc, review) => acc + review.rating, 0) /
            (reviews.length || 1)
    );

    return (
        <div className="card mb-4 shadow border-0 rounded-4 overflow-hidden">
            <div className="row g-0">
                {/* Image Section */}
                <div className="col-md-5">
                    <Link to={`/campgrounds/${campground._id}`}>
                        <div className="campground-card-img-container">
                            <img
                                src={campground.image}
                                alt={campground.title}
                                className="campground-img"
                            />
                        </div>
                    </Link>
                </div>

                {/* Content Section */}
                <div className="col-md-7 d-flex flex-column justify-content-between p-4">
                    <div>
                        <h4 className="fw-bold mb-2">{campground.title}</h4>
                        <div className="text-muted mb-3 d-flex align-items-center">
                            <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                            <span>{campground.location}</span>
                        </div>
                        <p
                            className="text-secondary mb-0"
                            style={{
                                maxHeight: "4.5em",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                            title={campground.description}
                        >
                            {campground.description}
                        </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link
                            to={`/campgrounds/${campground._id}`}
                            className="btn btn-outline-primary rounded-pill px-4"
                        >
                            View Details
                        </Link>
                        <div className="text-end">
                            <StarRating rating={avgCampReview} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampgroundCard;
