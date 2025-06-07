import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useUser } from "../../contexts/userContext";
import CampgroundForm from "../CampgroundForm/CampgroundForm";

const EditCampgroundForm = () => {
    const { user } = useUser();
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        image: "",
        description: "",
    });
    const [campgroundOwnerId, setCampgroundOwnerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [editFormSubmitted, setEditFormSubmitted] = useState(false);

    // Fetch campground and store owner ID
    useEffect(() => {
        const fetchCampground = async () => {
            try {
                const res = await api.get(`/campgrounds/${id}`);
                const { title, location, price, image, description, owner } =
                    res.data;

                setFormData({
                    title,
                    location,
                    price: price.toString(),
                    image,
                    description,
                });

                const ownerId =
                    typeof owner === "string" ? owner : owner.id || owner._id;
                setCampgroundOwnerId(ownerId);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching campground:", err);
                setLoading(false); // Avoid infinite spinner on error

                navigate("/NotFound");
            }
        };

        fetchCampground();
    }, [id]);

    // Check authorization only after user AND campground are loaded
    useEffect(() => {
        if (!loading && user && campgroundOwnerId) {
            if (String(user._id || user.id) !== String(campgroundOwnerId)) {
                setUnauthorized(true);
            }
        }
    }, [loading, user, campgroundOwnerId]);

    const handleSubmit = async () => {
        setEditing(true);
        try {
            await api.patch(`/campgrounds/${id}`, {
                campground: {
                    ...formData,
                    price: parseFloat(formData.price),
                },
            });
            setEditFormSubmitted(true);
            setEditing(false);
        } catch (err) {
            console.error("Error updating campground:", err);
            setEditing(false);
        }
    };

    // Redirect cases
    if (!user)
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    message: "Please first confirm your identity.",
                    type: "info",
                }}
            />
        );
    if (unauthorized) {
        return (
            <Navigate
                to="/campgrounds"
                replace
                state={{
                    message:
                        "You are not authorized to make changes to that campground.",
                    type: "error",
                }}
            />
        );
    }

    if (editFormSubmitted === true) {
        return (
            <Navigate
                to={`/campgrounds/${id}`}
                replace
                state={{
                    message: "Campground updated successfully.",
                    type: "success",
                }}
            />
        );
    }

    if (loading) {
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

    if (editing) {
        return (
            <div
                className="container mt-5 d-flex justify-content-center align-items-center"
                style={{ minHeight: "50vh" }}
            >
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Editing</span>
                    </div>
                    <div className="mt-2">Editing</div>
                </div>
            </div>
        );
    }

    // Render form with glassmorphism styling
    return (
        <>
            <div className="background-image"></div>

            <div className="glass-container container mt-5 p-4 rounded">
                <h2 className="text-white mb-4">Edit Campground</h2>
                <CampgroundForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    isEdit={true}
                    editing={editing}
                    setEditing={setEditing}
                />
            </div>

            <style>{`
        .background-image {
          background-image: url('${formData.image}');
          
        }
      `}</style>
        </>
    );
};

export default EditCampgroundForm;
