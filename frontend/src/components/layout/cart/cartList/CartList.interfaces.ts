export interface CartListProps {
    cartItemsData: {
        image: string;
        name: string;
        productId: string;
        count: number;
        price: number;
    }[];
}
