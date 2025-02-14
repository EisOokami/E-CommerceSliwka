"use client";

import Image from "next/image";
import { ReviewCommentProps } from "./ReviewComment.interfaces";
import RatingStars from "../ratingStars/RatingStars";

export default function ReviewComment({ review }: ReviewCommentProps) {
    return (
        <article className="flex items-start gap-3 md:gap-5 p-3 md:p-5 bg-gray-100 rounded-xl">
            <Image
                src={review.avatar}
                width={70}
                height={70}
                alt={review.fullname}
                className="w-14 h-14 rounded-full object-contain"
            />
            <div className="grid gap-1 w-full">
                <div className="flex justify-between items-start">
                    <div className="grid gap-1">
                        <h6 className="text-lg md:text-xl font-medium">
                            {review.fullname}
                        </h6>
                        <RatingStars count={review.rating} />
                    </div>
                    <span className="text-gray-500">
                        {review.publicationDate}
                    </span>
                </div>
                <p className="text-gray-600 text-pretty">{review.comment}</p>
                {review.images && (
                    <div className="flex flex-wrap gap-3">
                        {review.images.map((image, i) => (
                            <Image
                                key={i}
                                src={image}
                                alt={`${review.fullname}${i}`}
                                width={300}
                                height={300}
                                className="w-20 md:w-32 h-16 md:h-24 rounded-xl cursor-pointer"
                            />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
