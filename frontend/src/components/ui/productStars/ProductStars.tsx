import { ProductStarsProps } from "./ProductStars.interfaces";

import RatingStars from "../ratingStars/RatingStars";

export default function ProductStars({
    averageRating,
}: Readonly<ProductStarsProps>) {
    return (
        <div className="flex items-center gap-2">
            <RatingStars count={averageRating} />
            <span className="md:text-lg">{averageRating}</span>
        </div>
    );
}
