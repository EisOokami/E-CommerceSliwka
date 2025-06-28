import { memo } from "react";
import { twMerge } from "tailwind-merge";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RatingStarsProps } from "./RatingStars.interfaces";

const RatingStars = memo(function RatingStars({
    count,
    starsClassName = "",
}: Readonly<RatingStarsProps>) {
    const fullStars = count > 5 ? 5 : Math.floor(count);
    const hasHalfStar = count > 5 ? false : !Number.isInteger(count);
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    if (count > 5) {
        console.error("Rating count cannot be greater than 5");
    }

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar
                    key={i}
                    className={twMerge(
                        `text-2xl text-yellow-500 ${starsClassName}`,
                    )}
                />
            ))}
            {hasHalfStar && (
                <FaStarHalfAlt
                    className={twMerge(
                        `text-2xl text-yellow-500 ${starsClassName}`,
                    )}
                />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar
                    key={i}
                    className={twMerge(
                        `text-2xl text-yellow-500 ${starsClassName}`,
                    )}
                />
            ))}
        </div>
    );
});

export default RatingStars;
