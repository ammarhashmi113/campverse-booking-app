import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-3 text-danger fw-bold">404</h1>
            <p className="lead mb-4">
                Oops! You took a wrong turn into the wilderness.
            </p>
            <p className="text-muted">
                This page doesn't exist. Not even Bigfoot camps here.
            </p>
            <Link to="/campgrounds" className="btn btn-primary mt-3">
                🏕️ Go back to civilization
            </Link>
        </div>
    );
}
