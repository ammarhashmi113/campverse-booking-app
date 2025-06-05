import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import api from "./api/axiosConfig"; // axiosConfig sets base url and adds an interceptor to add the JWT token to every request
import { UserContext } from "./contexts/userContext"; // UserContext will help accessing user from any component

// Bootstrap for styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// For react toast messages
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./components/HomePage/HomePage";
import Campgrounds from "./components/Campgrounds/Campgrounds";
import IncomingRequests from "./components/Bookings/IncomingRequests/IncomingRequests";
import OutgoingRequests from "./components/Bookings/OutgoingRequests/OutgoingRequests";
import CampgroundDetail from "./components/CampgroundDetail/CampgroundDetail";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import AddCampgroundForm from "./components/AddCampgroundForm/AddCampgroundForm";
import EditCampgroundForm from "./components/EditCampgroundForm/EditCampgroundForm";
import CampgroundBookingPage from "./components/CampgroundBookingPage/CampgroundBookingPage";
import NotFound from "./components/NotFound/NotFound";

export default function App() {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
        } catch {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setUserLoading(false);

            // // Force minimum loading duration for UX (TEST)
            // setTimeout(() => {
            //     setUserLoading(false);
            // }, 800); // 800ms delay
        }
    };

    // Auto-login on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchCurrentUser();
        } else {
            setUserLoading(false); // No token? Not loading user
        }
    }, []);

    // useEffect(() => {
    //     const testToken = localStorage.getItem("token");
    //     console.log(localStorage.getItem("token"));
    //     console.log("🚀 useEffect triggered");
    //     if (testToken) {
    //         api.get("/auth/me", {
    //             headers: {
    //                 Authorization: `Bearer ${testToken}`,
    //             },
    //         })
    //             .then((res) => {
    //                 console.log("✅ /auth/me success", res.data);
    //             })
    //             .catch((err) => {
    //                 console.error("❌ /auth/me failed", err.response?.data);
    //             });
    //     }
    // }, []);

    return (
        <Router>
            <UserContext.Provider value={{ user, setUser }}>
                <div className="d-flex flex-column min-vh-100">
                    <Navbar setUser={setUser} userLoading={userLoading} />
                    <ToastContainer style={{ marginTop: "4rem" }} />
                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<Home />} />

                            {/* Putting More specific route FIRST */}
                            <Route
                                path="/campgrounds/my-campgrounds"
                                element={
                                    <Campgrounds
                                        apiPath="/campgrounds/me"
                                        title="My Listings"
                                        userLoading={userLoading}
                                    />
                                }
                            />

                            {/* Standard campgrounds list */}
                            <Route
                                path="/campgrounds"
                                element={
                                    <Campgrounds
                                        apiPath="/campgrounds"
                                        title="Explore Camps"
                                        userLoading={userLoading}
                                    />
                                }
                            />

                            {/* Campground Create */}
                            <Route
                                path="/campgrounds/new"
                                element={<AddCampgroundForm />}
                            />

                            {/* Campground Edit */}
                            <Route
                                path="/campgrounds/:id/edit"
                                element={
                                    userLoading ? (
                                        <div className="container mt-4">
                                            Checking credentials...
                                        </div>
                                    ) : (
                                        <EditCampgroundForm />
                                    )
                                }
                            />

                            {/* Campground Book */}
                            <Route
                                path="/campgrounds/:id/book"
                                element={<CampgroundBookingPage />}
                            />

                            {/* Campground Detail (least specific - putting LAST among campground routes) */}
                            <Route
                                path="/campgrounds/:id"
                                element={<CampgroundDetail />}
                            />

                            <Route
                                path="/incoming-requests"
                                element={
                                    <IncomingRequests
                                        userLoading={userLoading}
                                    />
                                }
                            />

                            <Route
                                path="/outgoing-requests"
                                element={
                                    <OutgoingRequests
                                        userLoading={userLoading}
                                    />
                                }
                            />

                            {/* Auth routes */}
                            <Route
                                path="/login"
                                element={
                                    user ? (
                                        <Navigate to="/campgrounds" />
                                    ) : (
                                        <LoginForm
                                            fetchCurrentUser={fetchCurrentUser}
                                        />
                                    )
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    user ? (
                                        <Navigate to="/campgrounds" />
                                    ) : (
                                        <RegisterForm
                                            fetchCurrentUser={fetchCurrentUser}
                                        />
                                    )
                                }
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </UserContext.Provider>
        </Router>
    );
}
