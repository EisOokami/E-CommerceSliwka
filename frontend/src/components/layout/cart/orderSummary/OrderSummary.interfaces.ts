import { IStore } from "@/interfaces/interfaces";

export interface OrderSummaryProps {
    cartItemsData: {
        id: number;
        documentId: number;
        quantity: number;
        store: IStore;
        user: {
            documentId: number;
            id: number;
        };
    }[];
}
