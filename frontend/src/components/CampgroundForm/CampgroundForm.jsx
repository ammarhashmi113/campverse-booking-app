import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CampgroundForm = ({
    formData,
    setFormData,
    onSubmit,
    isEdit = false,
}) => {
    const [validationState, setValidationState] = useState({
        title: true,
        location: true,
        price: true,
        description: true,
        image: true,
    });

    const [touched, setTouched] = useState({
        title: false,
        location: false,
        price: false,
        description: false,
        image: false,
    });

    useEffect(() => {
        document.title = "About | My Website";
    }, []);

    useEffect(() => {
        // Reset touched state on mount (mainly for edit)
        setTouched({
            title: false,
            location: false,
            price: false,
            description: false,
            image: false,
        });
    }, [isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? value : value, // keep as string for validation
        }));

        setTouched((prev) => ({ ...prev, [name]: true }));

        setValidationState((prev) => ({
            ...prev,
            [name]: value.trim() !== "",
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newValidationState = {};

        for (const field in formData) {
            const value = formData[field];
            if (
                value === undefined ||
                value === null ||
                (typeof value === "string" && value.trim() === "")
            ) {
                newValidationState[field] = false;
                isValid = false;
            } else {
                newValidationState[field] = true;
            }
        }

        setValidationState(newValidationState);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setTouched({
            title: true,
            location: true,
            price: true,
            description: true,
            image: true,
        });

        if (!validateForm()) return;

        onSubmit(); // calls the parent handler
    };

    return (
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {/* Title */}
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    name="title"
                    className={`form-control ${
                        touched.title
                            ? validationState.title
                                ? "is-valid"
                                : "is-invalid"
                            : ""
                    }`}
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                {touched.title && !validationState.title && (
                    <div className="invalid-feedback">
                        Please provide a title.
                    </div>
                )}
            </div>

            {/* Location */}
            <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                    name="location"
                    className={`form-control ${
                        touched.location
                            ? validationState.location
                                ? "is-valid"
                                : "is-invalid"
                            : ""
                    }`}
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                {touched.location && !validationState.location && (
                    <div className="invalid-feedback">
                        Please provide a location.
                    </div>
                )}
            </div>

            {/* Image */}
            <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                    name="image"
                    className={`form-control ${
                        touched.image
                            ? validationState.image
                                ? "is-valid"
                                : "is-invalid"
                            : ""
                    }`}
                    value={formData.image}
                    onChange={handleChange}
                    required
                />
                {touched.image && !validationState.image && (
                    <div className="invalid-feedback">
                        Please provide an image URL.
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="mb-3">
                <label className="form-label">Price</label>
                <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                        type="number"
                        name="price"
                        className={`form-control ${
                            touched.price
                                ? validationState.price
                                    ? "is-valid"
                                    : "is-invalid"
                                : ""
                        }`}
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                {touched.price && !validationState.price && (
                    <div className="invalid-feedback">
                        Please enter a valid price.
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    className={`form-control ${
                        touched.description
                            ? validationState.description
                                ? "is-valid"
                                : "is-invalid"
                            : ""
                    }`}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                ></textarea>
                {touched.description && !validationState.description && (
                    <div className="invalid-feedback">
                        Please provide a description.
                    </div>
                )}
            </div>

            <button type="submit" className="btn btn-success rounded-pill">
                {isEdit ? "Update" : "Add"}
            </button>
            <Link to="/campgrounds">
                <button
                    className="btn btn-light ms-2 rounded-pill"
                    style={{ display: "inline-block" }}
                >
                    All Camps
                </button>
            </Link>
        </form>
    );
};

export default CampgroundForm;
