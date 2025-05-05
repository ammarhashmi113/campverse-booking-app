import { useUser } from "../../contexts/userContext";

function CampgroundListLoadingSkeleton() {
    const skeletonCount = 6; // Change this number if you want more or fewer skeletons
    const skeletonArray = new Array(skeletonCount).fill(0); // Create an array of the desired length

    return (
        <>
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
