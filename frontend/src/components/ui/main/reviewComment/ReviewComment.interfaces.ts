import { IReview, IUserMeLoader } from "@/interfaces/interfaces";

export interface ReviewCommentProps {
    productDocumentId: string;
    review: IReview;
    user: IUserMeLoader;
}
