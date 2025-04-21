export interface OrderSummaryProps {
    cartItemsData: {
        image: string;
        name: string;
        productId: string;
        count: number;
        price: number;
    }[];
}
