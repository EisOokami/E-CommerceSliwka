export interface IProductInfo {
    id: number;
    documentId: string;
    delivery: string;
    inStore: string;
    guaranteed: string;
}

export interface ProductInfoProps {
    infoData: IProductInfo;
}
