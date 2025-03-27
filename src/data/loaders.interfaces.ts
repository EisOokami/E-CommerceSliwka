export interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
}

export interface IProductInfo {
    id: number;
    documentId: string;
    delivery: string;
    inStore: string;
    guaranteed: string;
}

export interface IProductSpecs {
    id: number;
    documentId: string;
    icon: string;
    name: string;
    specification: string;
}

export interface ISpecification {
    id: number;
    item: string;
}
export interface ISpecifications {
    id: number;
    name: string;
    specifications: ISpecification[];
}

export interface IDetailedSpecifications {
    id: number;
    name: string;
    specifications: ISpecifications[];
}

export interface IReviews {
    id: number;
    documentId: string;
    fullname: string;
    description: string;
    rating: number;
    publicationDate: string;
    images: Image[];
    avatar: Image;
}

export interface ICategory {
    id: number;
    category: string;
}

export interface IArray {
    id: number;
    item: string;
}

export interface IStore {
    id: number;
    documentId: string;
    name: string;
    price: number;
    description: string;
    discountedPrice: number | null;
    isDiscount: boolean;
    category: ICategory;
    image: Image;
    sliderImages: Image[];
    colors: IArray[];
    options: IArray[];
    productInfo: IProductInfo;
    productSpecs: IProductSpecs[];
    detailedSpecifications: IDetailedSpecifications[];
    reviews: IReviews[];
}
