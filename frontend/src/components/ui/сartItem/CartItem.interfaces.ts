import { IStore } from "@/interfaces/interfaces";

export interface CartItemProps {
    cartItem: {
        id: number;
        documentId: number;
        quantity: number;
        store: IStore;
        user: {
            documentId: number;
            id: number;
        };
    };
}
