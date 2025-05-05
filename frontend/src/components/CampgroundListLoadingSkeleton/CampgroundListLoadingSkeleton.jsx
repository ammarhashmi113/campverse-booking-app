import { useUser } from "../../contexts/userContext";

function CampgroundListLoadingSkeleton({ apiPath }) {
    const skeletonCount = 6; // Change this number if you want more or fewer skeletons
    const skeletonArray = new Array(skeletonCount).fill(0); // Create an array of the desired length
    const { user } = useUser();

    return (
        <>
            {!user && apiPath === "/campgrounds" ? (
                <div className="mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center placeholder-glow">
                            <h5 className="card-title placeholder col-2 mx-auto d-block mb-3"></h5>
                            <p className="card-text placeholder col-6 mx-auto d-block"></p>
                            <div className="d-flex justify-content-center gap-2">
                                <div className="btn btn-secondary disabled palceholder col-1"></div>
                                <div className="btn btn-secondary disabled placeholder col-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}

            {user ? (
                <div className="btn btn-secondary disabled placeholder col-2 mb-0"></div>
            ) : (
                ""
            )}

            {skeletonArray.map((_, index) => (
                <div key={index} className="card mt-4 mb-4 shadow-sm">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <div className="placeholder-glow">
                                <div
                                    className="placeholder w-100"
                                    style={{
                                        height: "200px",
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title placeholder col-6"></h5>
                                <p className="card-text placeholder col-11 d-block"></p>
                                <p className="card-text placeholder col-10 d-block"></p>
                                <p className="card-text">
                                    <small className="text-muted placeholder col-4"></small>
                                </p>
                                {/* <div className="d-flex justify-content-between">
                                    <div
                                        className="placeholder w-100"
                                        style={{
                                            height: "10px",
                                        }}
                                    ></div>
                                </div> */}
                                <div className="btn btn-secondary disabled placeholder col-4 mt-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default CampgroundListLoadingSkeleton;
