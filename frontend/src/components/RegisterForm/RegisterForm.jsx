import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", formData);
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            onLogin(user);
            navigate("/campgrounds", {
                replace: true,
                state: {
                    message: "Registration successful!",
                    type: "success",
                },
            });
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    useEffect(() => {
        document.title = "Campverse - Register";
    }, []);

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div
                className="card shadow-sm"
                style={{ maxWidth: "400px", width: "100%" }}
            >
                <img
                    src="https://img.freepik.com/free-photo/beautiful-shot-orange-tent-rocky-mountain-surrounded-by-trees-sunset_181624-3908.jpg?t=st=1745577221~exp=1745580821~hmac=ecc438f7d19fc00a29d63dfc2351974bf9a6710d9e61eccbeb075d4e92119461&w=996"
                    alt="campground"
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <h3 className="card-title text-center mb-3">Register</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
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
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Signup
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
