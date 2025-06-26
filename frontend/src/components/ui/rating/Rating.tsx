"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { RatingProps } from "./Rating.interfaces";

export default function Rating({
    maxStars = 5,
    onRate,
    initialRating = 0,
    isEdited = false,
    starsClassName = "",
}: RatingProps) {
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
                <FaStar
                    key={i + 20}
                    className={twMerge(
                        `transition-colors duration-200 ${
                            (hover ?? rating) >= i + 1
                                ? "fill-yellow-400 stroke-yellow-400"
                                : "fill-gray-300 stroke-gray-300"
                        } ${
                            isEdited ? "cursor-pointer" : ""
                        } ${starsClassName}`,
                    )}
                    onMouseEnter={() =>
                        isEdited ? setHover(i + 1) : undefined
                    }
                    onMouseLeave={() => setHover(null)}
                    onClick={() => (isEdited ? handleClick(i + 1) : undefined)}
                />
            ))}
            {[...Array(maxStars - rating)].map((_, i) => (
                <FaRegStar
                    key={i}
                    className={twMerge(
                        `transition-colors duration-200 ${
                            (hover ?? rating + i + 1) >= rating + i + 1
                                ? "fill-yellow-400 stroke-yellow-400"
                                : "fill-gray-300 stroke-gray-300"
                        } ${
                            isEdited ? "cursor-pointer" : ""
                        } ${starsClassName}`,
                    )}
                    onMouseEnter={() =>
                        isEdited ? setHover(rating + i + 1) : undefined
                    }
                    onMouseLeave={() => setHover(null)}
                    onClick={() =>
                        isEdited ? handleClick(rating + i + 1) : undefined
                    }
                />
            ))}
        </div>
    );
}
