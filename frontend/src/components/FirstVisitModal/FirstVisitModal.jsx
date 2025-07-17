import { useEffect, useState } from "react";

const FirstVisitModal = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenBackendNotice");
        if (!hasSeen) {
            setShowModal(true);
            localStorage.setItem("hasSeenBackendNotice", "true");
        }
    }, []);

    useEffect(() => {
        if (showModal) {
            // Lock scroll
            document.body.style.overflow = "hidden";
        } else {
            // Unlock scroll
            document.body.style.overflow = "auto";
        }

        return () => {
            // Cleanup in case component unmounts
            document.body.style.overflow = "auto";
        };
    }, [showModal]);

    if (!showModal) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25"
            style={{ zIndex: 1050 }}
        >
            <div
                className="bg-white text-dark rounded-3 p-4 p-md-5 shadow border border-dark text-center"
                style={{ maxWidth: "500px", width: "90%" }}
            >
                <h2 className="fw-bold mb-3">Backend Notice</h2>
                <p className="mb-3">
                    Campverse's backend API is currently{" "}
                    <strong>offline</strong> due to usage limits of the free
                    hosting tier. Features like logging in, booking, and
                    reviewing won't work right now.
                </p>
                <p className="text-muted mb-4">
                    You can still explore the interface or check out the full
                    code on{" "}
                    <a
                        href="https://github.com/ammarhashmi113/campverse-booking-app"
                        className="text-decoration-underline text-dark fw-semibold"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    .
                </p>
                <div className="d-flex justify-content-center">
                    <button
                        onClick={() => setShowModal(false)}
                        className="btn btn-dark px-4 py-2"
                    >
                        Continue to site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FirstVisitModal;
