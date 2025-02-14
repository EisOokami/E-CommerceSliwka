export interface ReviewCommentProps {
    review: {
        avatar: string;
        fullname: string;
        rating: number;
        comment: string;
        publicationDate: string;
        images: string[];
    };
}
