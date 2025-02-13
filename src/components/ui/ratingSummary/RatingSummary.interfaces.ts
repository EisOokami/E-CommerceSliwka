export interface RatingSummaryProps {
    reviewsData: {
        avatar: string;
        fullname: string;
        rating: number;
        comment: string;
        publicationDate: string;
        images: string[];
    }[];
}
