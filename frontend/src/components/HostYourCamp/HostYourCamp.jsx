import { Link } from "react-router-dom";
function HostYourCamp() {
    return (
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
                    Join our community of outdoor lovers and start earning from
                    your land or property today.
                </p>
                <Link
                    to="/campgrounds/new"
                    className="btn btn-success btn-lg shadow"
                >
                    Start Hosting
                </Link>
            </div>
        </section>
    );
}

export default HostYourCamp;
