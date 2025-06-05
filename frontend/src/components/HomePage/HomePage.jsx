import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import NewlyAddedCamps from "../../components/NewlyAddedCamps/NewlyAddedCamps";

const HomePage = () => {
    const [newCamps, setNewCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Campverse - Homepage";

        const fetchNewCamps = async () => {
            try {
                const response = await api.get(
                    "/campgrounds?sort=latest&limit=6"
                );
                setNewCamps(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load new campgrounds", err);
                setIsLoading(false);
            }
        };

        fetchNewCamps();
    }, []);

    return (
        <div className="bg-light text-dark">
            {/* Hero Section */}
            <section
                className="text-white text-center d-flex align-items-center"
                style={{
                    background:
                        "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/campgroundHomepage.jpg') center/cover no-repeat",
                    minHeight: "100vh",
                }}
            >
                <div className="container">
                    <h1 className="display-3 fw-bold">Campverse</h1>
                    <p className="lead mt-3 mb-4">
                        Discover, review & book the best campgrounds worldwide
                        🌍
                    </p>
                    <Link
                        to="/campgrounds"
                        className="btn btn-success btn-lg shadow"
                    >
                        🌄 Explore Now
                    </Link>
                </div>
            </section>
            {/* About Section */}
            <section className="py-5 bg-white">
                <div className="container text-center">
                    <h2 className="fw-bold">What is Campverse?</h2>
                    <p className="lead mt-3">
                        Campverse is your one-stop destination for outdoor
                        adventures. Whether you're a camper, traveler, or host —
                        we connect you to the perfect camping experiences.
                    </p>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="fw-bold mb-4">How It Works</h2>
                    <div className="row g-4">
                        {[
                            {
                                icon: "🔍",
                                title: "Find",
                                text: "Search thousands of user-submitted campgrounds.",
                            },
                            {
                                icon: "🛏",
                                title: "Book",
                                text: "Instantly request bookings from campground hosts.",
                            },
                            {
                                icon: "✍️",
                                title: "Review",
                                text: "Rate and review your experience to guide others.",
                            },
                        ].map((step, idx) => (
                            <div className="col-md-4" key={idx}>
                                <div className="card border-0 shadow h-100">
                                    <div className="card-body">
                                        <div className="display-5 mb-3">
                                            {step.icon}
                                        </div>
                                        <h5 className="card-title">
                                            {step.title}
                                        </h5>
                                        <p className="card-text">{step.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newly Added Camps */}
            {!isLoading && (
                <NewlyAddedCamps limit={6} title={"Newly Added Camps"} />
            )}

            {/* More Campsites */}
            <section className="bg-white py-5">
                <div className="container text-center">
                    <h3 className="fw-bold">
                        Explore 50,000+ unique campsites
                    </h3>
                    <p className="mb-4">
                        Campgrounds you won't find anywhere else.
                    </p>
                    <Link
                        to="/campgrounds"
                        className="btn btn-outline-success shadow"
                    >
                        Explore Now
                    </Link>
                </div>
            </section>

            {/* Hosting Section */}
            <section
                className="text-white text-center d-flex align-items-center"
                style={{
                    background:
                        "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/host-campground.jpg') center/cover no-repeat",
                    minHeight: "40vh",
                }}
            >
                <div className="container">
                    <h1 className="display-3 fw-bold">Host Your Camp</h1>
                    <p className="lead mt-3 mb-4">
                        Join our community of outdoor lovers and start earning
                        from your land or property today.
                    </p>
                    <Link
                        to="/campgrounds/new"
                        className="btn btn-success btn-lg shadow"
                    >
                        Start Hosting
                    </Link>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-5 bg-white">
                <div className="container text-center">
                    <h2 className="fw-bold mb-4">Testimonials</h2>
                    <div className="row g-4">
                        {[
                            {
                                name: "Outdoor Explorer",
                                quote: "I planned my entire summer trip using Campverse. It’s my go-to app now!",
                            },
                            {
                                name: "Nature Lover",
                                quote: "Thanks to Campverse, I found hidden gems that aren’t even on Google Maps.",
                            },
                            {
                                name: "Camp Host",
                                quote: "As a host, I love how easy it is to list my campground and accept bookings.",
                            },
                        ].map((review, idx) => (
                            <div className="col-md-4" key={idx}>
                                <div className="card border-0 shadow h-100">
                                    <div className="card-body">
                                        <p className="fst-italic">
                                            “{review.quote}”
                                        </p>
                                        <footer className="blockquote-footer mt-3">
                                            {review.name}
                                        </footer>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-5 bg-success text-white text-center">
                <div className="container">
                    <h2 className="fw-bold">Ready to start your adventure?</h2>
                    <p className="lead">
                        Join Campverse and never miss a great camping spot
                        again.
                    </p>
                    <Link
                        to="/register"
                        className="btn btn-light btn-lg shadow"
                    >
                        🚀 Get Started
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-4">
                <div className="container">
                    <p className="mb-1">
                        © {new Date().getFullYear()} Campverse. All rights
                        reserved.
                    </p>
                    <small>
                        Built with ❤️ by Ammar |{" "}
                        <a
                            href="https://github.com/ammarhashmi113"
                            className="text-white text-decoration-underline"
                        >
                            GitHub
                        </a>
                    </small>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
