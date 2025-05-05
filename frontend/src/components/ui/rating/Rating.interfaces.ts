export interface RatingProps {
    maxStars?: number;
    onRate?: (value: number) => void;
    initialRating?: number;
    isEdited?: boolean;
    size?: "small" | "medium" | "large";
}
