export interface IImage {
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

export interface IArray {
    id: number;
    item: string;
}

export interface ISpecifications {
    id: number;
    name: string;
    specifications: IArray[];
}

export interface IDetailedSpecifications {
    id: number;
    name: string;
    specifications: ISpecifications[];
}

export interface IReviews {
    id: number;
    documentId: string;
    description: string;
    rating: number;
    publicationDate: string;
    images: IImage[] | null;
    user: IUser;
    product: IProduct;
    lastEdited: string | null;
}

export interface ICategory {
    id: number;
    category: string;
}

export interface IColors {
    id: number;
    documentId: string;
    colorHex: string;
    colorName: string;
    priceDifference: number;
    product: IProduct;
}

export interface IOptions {
    id: number;
    documentId: string;
    value: string;
    priceDifference: number;
    isStock: boolean;
    product: IProduct;
}

export interface IProduct {
    id: number;
    documentId: string;
    name: string;
    price: number;
    description: string;
    discountedPrice: number | null;
    isDiscount: boolean;
    category: ICategory;
    image: IImage;
    sliderImages: IImage[];
    colors: IColors[] | null;
    options: IOptions[] | null;
    productInfo: IProductInfo;
    productSpecs: IProductSpecs[];
    detailedSpecifications: IDetailedSpecifications[];
    averageRating: number;
    reviews: IReviews[];
    wishlist: IWishlist[];
    slug: string;
}

export interface ILink {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

export interface IUtilityLink {
    id: number;
    title: string;
    links: ILink[];
}

export interface ICart {
    id: number;
    documentId: string;
    quantity: number;
    product: IProduct;
    user: {
        documentId: string;
        id: number;
    };
    option: IOptions | null;
    color: IColors | null;
}

export interface IUser {
    id: number;
    documentId: string;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    provider: string;
    productsCart: ICart[];
    avatar: IImage;
    wishlist: IWishlist[];
}

export interface IUserMeLoader {
    ok: boolean;
    data: IUser | null;
    error: Error | null;
}

export interface IWishlist {
    documentId: string;
    user: IUser;
    product: IProduct;
}
