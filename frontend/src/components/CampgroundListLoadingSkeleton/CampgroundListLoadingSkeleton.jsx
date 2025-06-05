import { useUser } from "../../contexts/userContext";

function CampgroundListLoadingSkeleton() {
    const skeletonCount = 6; // Change this number if you want more or fewer skeletons
    const skeletonArray = new Array(skeletonCount).fill(0); // Create an array of the desired length

    return (
        <>
            {skeletonArray.map((_, index) => (
                <div
                    key={index}
                    className="card mb-4 shadow border-0 rounded-4 overflow-hidden"
                >
                    <div className="row g-0">
                        <div className="col-md-5">
                            <div className="placeholder-glow h-100">
                                <div
                                    className="placeholder w-100 h-100"
                                    style={{
                                        height: "100%",
                                        minHeight: "350px",
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="col-md-7 d-flex flex-column justify-content-between p-3">
                            <div>
                                <h5 className="placeholder-glow">
                                    <span className="placeholder col-6 rounded"></span>
                                </h5>
                                <p className="placeholder-glow">
                                    <span className="placeholder col-4 rounded"></span>
                                </p>
                                <p className="placeholder-glow">
                                    <span className="placeholder col-11 rounded d-block mb-2"></span>
                                </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="btn btn-secondary disabled placeholder"
                                    style={{ minWidth: "10.6rem" }}
                                ></span>
                                <div className="d-flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="placeholder rounded-circle"
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                            }}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default CampgroundListLoadingSkeleton;
