"use client";

import { useState } from "react";
import ReviewComment from "@/components/ui/reviewComment/ReviewComment";
import Button from "@/components/ui/button/Button";
import { ReviewListProps } from "./ReviewList.interfaces";

export default function ReviewList({ reviewsData }: ReviewListProps) {
    const [displayedData, setDisplayedData] = useState(reviewsData.slice(0, 3));
    const [visibleItemCount, setVisibleItemCount] = useState(3);

    const handleLoadMore = () => {
        setVisibleItemCount((prevCount) => prevCount + 3);

        setDisplayedData(reviewsData.slice(0, visibleItemCount + 3));
    };

    return (
        <div className="grid gap-5">
            {displayedData.map((review, i) => (
                <ReviewComment key={i} review={review} />
            ))}
            {reviewsData.length !== displayedData.length && (
                <div className="w-full text-center">
                    <Button
                        text="View more"
                        theme="dark"
                        inline
                        onClick={handleLoadMore}
                    />
                </div>
            )}
        </div>
    );
}
