"use client";

import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { RatingProps } from "./Rating.interfaces";

export default function Rating({
    maxStars = 5,
    onRate,
    initialRating = 0,
    isEdited = false,
    size = "medium",
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
        <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
                <FaStar
                    key={i + 20}
                    size={24}
                    className={`transition-colors duration-200 ${
                        (hover ?? rating) >= i + 1
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "fill-gray-300 stroke-gray-300"
                    } ${isEdited ? "cursor-pointer" : ""} ${
                        size === "small"
                            ? "w-5 h-5"
                            : size === "medium"
                            ? "w-6 h-6"
                            : "w-7 h-7"
                    }`}
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
                    size={24}
                    className={`transition-colors duration-200 ${
                        (hover ?? rating + i + 1) >= rating + i + 1
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "fill-gray-300 stroke-gray-300"
                    } ${isEdited ? "cursor-pointer" : ""} ${
                        size === "small"
                            ? "w-5 h-5"
                            : size === "medium"
                            ? "w-6 h-6"
                            : "w-7 h-7"
                    }`}
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
