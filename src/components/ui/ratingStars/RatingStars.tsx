import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RatingStarsProps } from "./RatingStars.interfaces";

export default function RatingStars({ count }: RatingStarsProps) {
    const fullStars = count > 5 ? 5 : Math.floor(count);
    const hasHalfStar = count > 5 ? false : !Number.isInteger(count);
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    if (count > 5) {
        console.error("Rating count cannot be greater than 5");
    }

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={i} className="text-2xl text-yellow-500" />
            ))}
            {hasHalfStar && (
                <FaStarHalfAlt className="text-2xl text-yellow-500" />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar key={i} className="text-2xl text-yellow-500" />
            ))}
        </div>
    );
}
