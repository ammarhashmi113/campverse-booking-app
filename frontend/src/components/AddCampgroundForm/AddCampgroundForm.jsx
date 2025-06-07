import "./AddCampgroundForm.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import CampgroundForm from "../CampgroundForm/CampgroundForm";
import { useUser } from "../../contexts/userContext";

const AddCampgroundForm = () => {
    const { user, userLoading } = useUser();
    const [addFormSubmitted, setAddFormSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        image: "",
        description: "",
    });

    const handleSubmit = async () => {
        try {
            const res = await api.post("/campgrounds", {
                campground: {
                    ...formData,
                    price: parseFloat(formData.price),
                },
            });
            setAddFormSubmitted(res);
        } catch (err) {
            console.error("Error adding campground:", err);
        }
    };

    if (userLoading) {
        return (
            <div
                className="container mt-5 d-flex justify-content-center align-items-center"
                style={{ minHeight: "50vh" }}
            >
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading</span>
                    </div>
                    <div className="mt-2">Loading</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    message: "Please login to add your campground",
                    type: "info",
                }}
            />
        );
    }

    if (addFormSubmitted !== false) {
        return (
            <Navigate
                to={`/campgrounds/my-campgrounds`}
                replace
                state={{
                    message: "Campground created successfully.",
                    type: "success",
                }}
            />
        );
    }

    return (
        <>
            <div className="background-image"></div>

            <div className="glass-container container mt-5 p-4 rounded">
                <h2 className="text-white text-center mb-4">Host Your Camp</h2>
                <CampgroundForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    isEdit={false}
                />
            </div>
        </>
    );
};

export default AddCampgroundForm;
