"use client";

import useProductStore from "@/stores/product";
import { RatingSummaryProps } from "./RatingSummary.interfaces";

import RatingStars from "@/components/ui/ratingStars/RatingStars";

export default function RatingSummary({
    reviewsData,
    averageRating,
}: Readonly<RatingSummaryProps>) {
    const updatedAverageRating = useProductStore(
        (state) => state.updatedAverageRating,
    );
    const updatedReviewsData = useProductStore(
        (state) => state.updatedReviewsData,
    );

    const validatedAverageRating =
        updatedAverageRating !== null ? updatedAverageRating : averageRating;
    const validatedReviewsData =
        updatedReviewsData !== null ? updatedReviewsData : reviewsData;

    const totalReviews = validatedReviewsData.length;
    const counterStarsData = [
        {
            star: "5 star",
            countStars: validatedReviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 5 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "4 star",
            countStars: validatedReviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 4 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "3 star",
            countStars: validatedReviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 3 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "2 star",
            countStars: validatedReviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 2 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "1 star",
            countStars: validatedReviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 1 ? 1 : 0) + accumulator,
                0,
            ),
        },
    ];

    return (
        <div className="flex items-center gap-5 md:gap-10">
            <div className="grid justify-items-center gap-3 w-min p-4 sm:p-5 md:p-8 bg-gray-100 rounded-xl">
                <h2 className="text-4xl md:text-6xl font-semibold">
                    {validatedAverageRating}
                </h2>
                <span className="text-sm md:text-base text-gray-500 font-medium">
                    of {totalReviews} reviews
                </span>
                <RatingStars
                    count={validatedAverageRating}
                    starsClassName="text-lg md:text-2xl"
                />
            </div>
            <div className="grid gap-2 md:gap-5 w-full">
                {counterStarsData.map((counterStars, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-1 md:gap-5 w-full"
                    >
                        <div className="md:max-w-28 min-w-8 md:w-28">
                            <span className="w-full text-xs md:text-xl font-semibold">
                                {counterStars.star}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2.5">
                            <div
                                className="bg-yellow-500 h-1.5 md:h-2.5 rounded-full"
                                style={{
                                    width: `${
                                        (counterStars.countStars * 100) /
                                        totalReviews
                                    }%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-right text-xs md:text-xl text-gray-500">
                            {counterStars.countStars}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
