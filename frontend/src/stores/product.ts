import { IReview } from "@/interfaces/interfaces";
import { create } from "zustand";

interface IProductStore {
    updatedReviewsData: IReview[] | null;
    setUpdatedReviewsData: (newUpdatedReviewsData: IReview[] | null) => void;
    updatedAverageRating: number | null;
    setUpdatedAverageRating: (newUpdatedAverageRating: number | null) => void;
}

const useProductStore = create<IProductStore>((set) => ({
    updatedReviewsData: null,
    setUpdatedReviewsData: (newUpdatedReviewsData) =>
        set(() => ({
            updatedReviewsData: newUpdatedReviewsData,
        })),
    updatedAverageRating: null,
    setUpdatedAverageRating: (newUpdatedAverageRating) =>
        set(() => ({
            updatedAverageRating: newUpdatedAverageRating,
        })),
}));

export default useProductStore;
