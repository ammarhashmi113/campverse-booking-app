import axios from "axios";

const api = axios.create({
    baseURL: "/api",
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem("token");
        if (token) {
            // Add the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Proceed with the request
    },
    (error) => {
        // Handle request error if any
        return Promise.reject(error);
    }
);

export default api;
