"use client";

import { memo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { RatingProps } from "./Rating.interfaces";

const Rating = memo(function Rating({
    maxStars = 5,
    onRate,
    initialRating = 0,
    isEdited = false,
    starsClassName = "",
}: Readonly<RatingProps>) {
    const [rating, setRating] = useState<number>(initialRating);
    const [hover, setHover] = useState<number | null>(null);

    const handleClick = (value: number) => {
        setRating(value);

        if (onRate) {
            onRate(value);
        }
    };

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(rating)].map((_, i) => (
                <button
                    key={i + 20}
                    type="button"
                    onMouseEnter={() =>
                        isEdited ? setHover(i + 1) : undefined
                    }
                    onMouseLeave={() => setHover(null)}
                    onClick={() => (isEdited ? handleClick(i + 1) : undefined)}
                >
                    <FaStar
                        className={twMerge(
                            `transition-colors duration-200 ${
                                (hover ?? rating) >= i + 1
                                    ? "text-yellow-300"
                                    : "text-gray-300"
                            } ${
                                isEdited ? "cursor-pointer" : ""
                            } ${starsClassName}`,
                        )}
                    />
                </button>
            ))}
            {[...Array(maxStars - rating)].map((_, i) => (
                <button
                    key={i}
                    type="button"
                    onMouseEnter={() =>
                        isEdited ? setHover(rating + i + 1) : undefined
                    }
                    onMouseLeave={() => setHover(null)}
                    onClick={() =>
                        isEdited ? handleClick(rating + i + 1) : undefined
                    }
                >
                    <FaRegStar
                        className={twMerge(
                            `transition-colors duration-200 ${
                                (hover ?? rating + i + 1) >= rating + i + 1
                                    ? "text-yellow-300"
                                    : "text-gray-300"
                            } ${
                                isEdited ? "cursor-pointer" : ""
                            } ${starsClassName}`,
                        )}
                    />
                </button>
            ))}
        </div>
    );
});

export default Rating;
