import { IReview } from "@/interfaces/interfaces";

export interface RatingSummaryProps {
    reviewsData: IReview[];
    averageRating: number;
}
