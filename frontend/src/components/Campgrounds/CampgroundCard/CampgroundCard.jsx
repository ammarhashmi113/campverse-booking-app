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
        <div className="card mb-4 shadow rounded-4 overflow-hidden">
            <div className="row g-0">
                {/* <div className="col-md-5">
                    <Link to={`/campgrounds/${campground._id}`}>
                        <img
                            src={campground.image}
                            alt={campground.title}
                            className="img-fluid h-100 object-fit-cover"
                            style={{ objectFit: "cover", height: "100%" }}
                        />
                    </Link>
                </div> */}
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
                <div className="col-md-7 d-flex flex-column justify-content-between p-3">
                    <div>
                        <h5 className="card-title fw-bold">
                            {campground.title}
                        </h5>
                        <p className="text-muted mb-2">
                            <i className="bi bi-geo-alt-fill me-1"></i>
                            {campground.location}
                        </p>
                        <p
                            className="card-text text-truncate"
                            style={{ maxWidth: "100%" }}
                            title={campground.description}
                        >
                            {campground.description}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="mt-3">
                            <Link
                                to={`/campgrounds/${campground._id}`}
                                className="btn btn-outline-success w-auto rounded-pill mx-auto"
                            >
                                View Campground
                            </Link>
                        </div>
                        <div className="d-flex flex-column justify-content-center pt-3">
                            <StarRating rating={avgCampReview} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampgroundCard;
