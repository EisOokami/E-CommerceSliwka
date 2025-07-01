"use client";

import { useEffect, useState } from "react";
import useProductStore from "@/stores/product";
import { ReviewListProps } from "./ReviewList.interfaces";

import ReviewComment from "@/components/ui/reviewComment/ReviewComment";
import Button from "@/components/ui/button/Button";

export default function ReviewList({
    productData,
    user,
}: Readonly<ReviewListProps>) {
    const updatedReviewsData = useProductStore(
        (state) => state.updatedReviewsData,
    );
    const [displayedData, setDisplayedData] = useState(
        productData.reviews.slice(0, 3),
    );
    const [visibleItemCount, setVisibleItemCount] = useState(3);

    useEffect(() => {
        if (updatedReviewsData) {
            setDisplayedData(updatedReviewsData.slice(0, visibleItemCount));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedReviewsData]);

    const handleLoadMore = () => {
        setVisibleItemCount((prevCount) => prevCount + 3);

        setDisplayedData(
            updatedReviewsData
                ? updatedReviewsData.slice(0, visibleItemCount + 3)
                : productData.reviews.slice(0, visibleItemCount + 3),
        );
    };

    return (
        <div className="grid gap-5">
            {displayedData.map((review) => (
                <ReviewComment
                    key={review.id}
                    productDocumentId={productData.documentId}
                    review={review}
                    user={user}
                />
            ))}
            {(updatedReviewsData
                ? updatedReviewsData.length
                : productData.reviews.length) !== displayedData.length && (
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
