import { Dispatch, SetStateAction } from "react";

export interface PaginationProps {
    currentPage: number;
    setCurrentPage: (
        newCurrentPage: number,
    ) => void | Dispatch<SetStateAction<number>>;
    totalPages: number;
}
