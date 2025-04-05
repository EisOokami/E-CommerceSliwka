import { RatingSummaryProps } from "./RatingSummary.interfaces";

import RatingStars from "@/components/ui/ratingStars/RatingStars";

export default function RatingSummary({
    reviewsData,
}: Readonly<RatingSummaryProps>) {
    const totalReviews = reviewsData.length;
    const averageRating = +(
        reviewsData.reduce(
            (accumulator, currentValue) => currentValue.rating + accumulator,
            0,
        ) / totalReviews
    ).toFixed(1);
    const counterStarsData = [
        {
            star: "5 star",
            countStars: reviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 5 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "4 star",
            countStars: reviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 4 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "3 star",
            countStars: reviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 3 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "2 star",
            countStars: reviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 2 ? 1 : 0) + accumulator,
                0,
            ),
        },
        {
            star: "1 star",
            countStars: reviewsData.reduce(
                (accumulator, currentValue) =>
                    (currentValue.rating === 1 ? 1 : 0) + accumulator,
                0,
            ),
        },
    ];

    return (
        <div className="grid md:flex items-center gap-20">
            <div className="grid justify-items-center gap-3 md:w-min p-8 bg-gray-100 rounded-xl">
                <h2 className="text-6xl font-semibold">{averageRating}</h2>
                <span className="text-gray-500 font-medium">
                    of {totalReviews} reviews
                </span>
                <div>
                    <RatingStars count={averageRating} />
                </div>
            </div>
            <div className="grid gap-5 w-full">
                {counterStarsData.map((counterStars, i) => (
                    <div key={i} className="flex items-center gap-5 w-full">
                        <span className="w-28 text-xl font-semibold">
                            {counterStars.star}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-yellow-500 h-2.5 rounded-full"
                                style={{
                                    width: `${
                                        (counterStars.countStars * 100) /
                                        totalReviews
                                    }%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-right text-xl text-gray-500">
                            {counterStars.countStars}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
