export interface RatingProps {
    maxStars?: number;
    onRate?: (value: number) => void;
    currentRating?: number;
    initialRating?: number;
    isEdited?: boolean;
    starsClassName?: string;
}
