import { Dispatch, SetStateAction } from "react";

export interface RatingSelectProps {
    setProductRating: Dispatch<SetStateAction<string>>;
}
