import { useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    useEffect(() => {
        document.title = "Campverse - Homepage";
    }, []);

    return (
        <div className="bg-light text-dark">
            {/* Hero Section */}
            <section className="text-center py-5 bg-success text-white">
                <div className="container">
                    <h1 className="display-4 fw-bold">
                        Discover Campgrounds Near You
                    </h1>
                    <p className="lead mt-3 mb-4">
                        Explore, review, and book your perfect outdoor getaway
                        with YelpCamp.
                    </p>
                    <Link
                        to="/campgrounds"
                        className="btn btn-light btn-lg shadow"
                    >
                        🌄 Explore Campgrounds
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                    <div className="display-5 text-success mb-3">
                                        📍
                                    </div>
                                    <h5 className="card-title">
                                        Find Hidden Gems
                                    </h5>
                                    <p className="card-text">
                                        Browse campgrounds added by users
                                        worldwide.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                    <div className="display-5 text-warning mb-3">
                                        ⭐
                                    </div>
                                    <h5 className="card-title">
                                        Share Reviews
                                    </h5>
                                    <p className="card-text">
                                        Rate and review your stays to help other
                                        campers choose wisely.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                    <div className="display-5 text-info mb-3">
                                        🏞
                                    </div>
                                    <h5 className="card-title">
                                        Add Your Campground
                                    </h5>
                                    <p className="card-text">
                                        Share your favorite camping spot with
                                        the world. Upload photos, location, and
                                        details in just a few clicks!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote/Testimonial */}
            <section className="bg-light py-5">
                <div className="container text-center">
                    <blockquote className="blockquote">
                        <p className="fs-4 fst-italic">
                            "I planned my entire summer trip using YelpCamp.
                            It’s my go-to for campgrounds now."
                        </p>
                        <footer className="blockquote-footer mt-3">
                            Outdoor Explorer
                        </footer>
                    </blockquote>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
