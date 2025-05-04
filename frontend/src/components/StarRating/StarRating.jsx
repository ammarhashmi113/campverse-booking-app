import { BsStarFill, BsStar } from "react-icons/bs";

const getStarColor = (rating) => {
    if (rating === 1) return "#ff6a07";
    if (rating === 2 || rating === 3) return "#ffc107";
    return "#62ff07";
};

const StarRating = ({ rating }) => {
    return (
        <>
            <p className="mb-1">
                <span>
                    {[1, 2, 3, 4, 5].map((i) =>
                        i <= rating ? (
                            <BsStarFill
                                key={i}
                                style={{ color: getStarColor(rating) }}
                            />
                        ) : (
                            <BsStar key={i} className="text-muted" />
                        )
                    )}
                </span>
            </p>
        </>
    );
};

export default StarRating;
