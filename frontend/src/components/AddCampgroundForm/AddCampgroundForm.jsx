import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import CampgroundForm from "../CampgroundForm/CampgroundForm";
import { useUser } from "../../contexts/userContext";

// For react toast messages
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCampgroundForm = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [addFormSubmitted, setAddFormSubmitted] = useState(false);

    // Redirect cases
    useEffect(() => {
        if (!user)
            navigate("/login", {
                state: {
                    message: "Please login to add your campground",
                    type: "info",
                },
            });
    }, []);

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
            console.log("SETTING FORM SUBMITTED AS", res);
            setAddFormSubmitted(res);
        } catch (err) {
            console.error("Error adding campground:", err);
        }
    };

    if (addFormSubmitted !== false) {
        const id = addFormSubmitted.data._id;
        console.log(id);
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
        <div className="container mt-4">
            <h2>Add New Campground</h2>
            <CampgroundForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isEdit={false}
            />
        </div>
    );
};

export default AddCampgroundForm;
