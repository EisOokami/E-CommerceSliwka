import { IReviews, IUserMeLoader } from "@/interfaces/interfaces";

export interface ReviewCommentProps {
    productDocumentId: string;
    review: IReviews;
    user: IUserMeLoader;
}
