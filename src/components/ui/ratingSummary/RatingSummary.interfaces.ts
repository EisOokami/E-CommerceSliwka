export interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
}

export interface IReviews {
    id: number;
    documentId: string;
    fullname: string;
    description: string;
    rating: number;
    publicationDate: string;
    images: Image[];
    avatar: Image;
}

export interface RatingSummaryProps {
    reviewsData: IReviews[];
}
