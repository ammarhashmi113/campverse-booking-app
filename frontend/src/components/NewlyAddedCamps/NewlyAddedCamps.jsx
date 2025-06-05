import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

const NewlyAddedCamps = ({ limit = 6, title = "Newly Added Camps" }) => {
    const [newCamps, setNewCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewCamps = async () => {
            try {
                const response = await api.get(
                    `/campgrounds?sort=latest&limit=${limit}`
                );
                setNewCamps(response.data.campgrounds || []);
            } catch (err) {
                console.error("Failed to load new campgrounds", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewCamps();
    }, [limit]);

    if (isLoading) {
        return <p>Loading camps...</p>;
    }

    if (!newCamps.length) {
        return <p>No camps found.</p>;
    }

    return (
        <section className="py-5 bg-white">
            <div className="container">
                <h2 className="text-center mb-4">🌟 {title}</h2>
                <div className="row g-4">
                    {newCamps.map((camp) => (
                        <div className="col-md-4" key={camp._id}>
                            <div className="card h-100 shadow border-0 rounded-4">
                                <img
                                    src={
                                        camp?.image ||
                                        "/images/default-camp-image.png"
                                    }
                                    className="card-img-top"
                                    alt={camp.title}
                                    style={{
                                        objectFit: "cover",
                                        height: "200px",
                                    }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{camp.title}</h5>
                                    <p className="card-text text-muted mb-2">
                                        {camp.location}
                                    </p>
                                    <p className="card-text">
                                        {camp.description?.slice(0, 100)}...
                                    </p>
                                    <Link
                                        to={`/campgrounds/${camp._id}`}
                                        className="mt-auto btn btn-success"
                                    >
                                        View Campground
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewlyAddedCamps;
