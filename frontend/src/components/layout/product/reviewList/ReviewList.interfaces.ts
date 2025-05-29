import { IReviews, IUserMeLoader } from "@/interfaces/interfaces";

export interface ReviewListProps {
    reviewsData: IReviews[];
    user: IUserMeLoader;
}
