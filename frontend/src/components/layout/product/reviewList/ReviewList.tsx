"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useProductStore from "@/stores/product";
import { ReviewListProps } from "./ReviewList.interfaces";

import ReviewCommentSkeleton from "@/components/ui/reviewComment/ReviewCommentSkeleton";
const ReviewComment = dynamic(
    () => import("@/components/ui/reviewComment/ReviewComment"),
    { ssr: false, loading: () => <ReviewCommentSkeleton /> },
);
const Button = dynamic(() => import("@/components/ui/button/Button"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center w-full">
            <div className="w-24 md:w-36 h-10 md:h-14 bg-gray-200 rounded-lg"></div>
        </div>
    ),
});

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
