import "./Navbar.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

function Navbar({ setUser, userLoading }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const user = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setShowLogoutModal(false);
        navigate("/campgrounds", {
            state: { message: "You have been logged out.", type: "info" },
        });
    };

    return (
        <>
            <nav className="navbar">
                {/* Toggler in top-right */}
                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    ☰
                </button>

                <div
                    className="navbar-container"
                    onClick={() => setMenuOpen(false)}
                >
                    <Link to="/" className="navbar-logo">
                        Campverse
                    </Link>

                    <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
                        <li>
                            <Link to="/campgrounds">Explore</Link>
                        </li>
                        <li>
                            <Link to="/campgrounds/new">Add New</Link>
                        </li>
                        <li>
                            <Link to="/campgrounds/my-campgrounds">
                                My Listings
                            </Link>
                        </li>
                        <li>
                            <Link to="/incoming-requests">
                                Incoming Requests
                            </Link>
                        </li>
                        <li>
                            <Link to="/outgoing-requests">My Requests</Link>
                        </li>
                    </ul>

                    {!userLoading && (
                        <div
                            className={`navbar-auth ${menuOpen ? "open" : ""}`}
                        >
                            {!user.user ? (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn outline"
                                    >
                                        Signup
                                    </Link>
                                    <Link to="/login" className="btn fill">
                                        Login
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="btn danger"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            <ConfirmationModal
                show={showLogoutModal}
                message="Do you confirm to logout?"
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </>
    );
}

export default Navbar;
