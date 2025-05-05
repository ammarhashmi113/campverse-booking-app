import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // instead of calling http://localhost:3000/api/campgrounds, we'll call /api/campgrounds from our frontend and Vite will automatically forward it to the backend.
    server: {
        port: 5173,
        proxy: {
            "/api": "http://localhost:3000",
        },
        allowedHosts: [
            "7beb-2407-d000-f-77db-7920-336d-120a-6012.ngrok-free.app",
        ],
    },
});
