import "./LoginForm.css";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm = ({ fetchCurrentUser }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/login", formData);
            const { token } = res.data;
            localStorage.setItem("token", token);
            await fetchCurrentUser();

            setTimeout(() => {
                navigate("/campgrounds", {
                    replace: true,
                    state: {
                        message: "Login Success.",
                        type: "success",
                    },
                });
            }, 100);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Campverse - Login";
        document.body.classList.add("noscroll");

        return () => {
            document.body.classList.remove("noscroll"); // cleanup on unmount
        };
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            toast[location.state.type](location.state.message, {
                autoClose: 3000,
            });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <>
            <ToastContainer style={{ marginTop: "4rem" }} />
            <div className="login-page">
                <div className="overlay" />
                <div className="container d-flex justify-content-center align-items-center vh-100">
                    <div
                        className="card auth-card text-white shadow border-0 rounded-4 overflow-hidden"
                        style={{ maxWidth: "400px", width: "100%", zIndex: 1 }}
                    >
                        <img
                            src="https://img.freepik.com/free-photo/camping-tents-pine-trees-with-sunlight-pang-ung-lake-mae-hong-son-thailand_335224-931.jpg?t=st=1745577085~exp=1745580685~hmac=9ebaf89529c59c08e8d1a51dec68b40b6540f00b0c5ffc6164c27c5048c3e321&w=996"
                            alt="campground"
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                            <h3 className="card-title text-center mb-3">
                                Login
                            </h3>
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-glass w-50 px-4 py-2 d-block mx-auto"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
