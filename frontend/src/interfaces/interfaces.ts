import { DeliveryStatus } from "@/types/types";

export interface BaseSchema {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlockBase<TComponent extends string> extends Pick<
    BaseSchema,
    "id"
> {
    __component: TComponent;
}

export interface IImage extends Pick<BaseSchema, "id"> {
    url: string;
    alternativeText: string | null;
}

export interface IProductInfo extends Pick<BaseSchema, "id"> {
    delivery: string;
    inStore: string;
    guaranteed: string;
}

export interface IProductSpecs extends Pick<BaseSchema, "id"> {
    icon: string;
    name: string;
    specification: string;
}

export interface IArray extends Pick<BaseSchema, "id"> {
    item: string;
}

export interface ISpecifications extends Pick<BaseSchema, "id"> {
    name: string;
    specifications: IArray[];
}

export interface IDetailedSpecifications extends Pick<BaseSchema, "id"> {
    name: string;
    specifications: ISpecifications[];
}

export interface IReview extends BaseSchema {
    description: string;
    rating: number;
    publicationDate: string;
    images: IImage[] | null;
    user: Pick<IUser, "username" | "avatar" | "id">;
    product: Pick<IProduct, "id">;
    lastEdited: string | null;
}

export interface ICategory extends Pick<BaseSchema, "id"> {
    category: string;
}

export interface IOptionsArray extends Pick<BaseSchema, "id"> {
    optionName: string;
    productSlug: string;
    inStore: boolean;
}

export interface IOptions extends Pick<BaseSchema, "id"> {
    title: string;
    optionsArray: IOptionsArray[];
}

export interface IColors extends Pick<BaseSchema, "id"> {
    productSlug: string;
    colorName: string;
    colorHex: string;
    inStock: boolean;
}

export interface IProductOptions extends Pick<BaseSchema, "id"> {
    optionType: string;
    optionName: string;
}

export enum Status {
    active,
    published,
    ok,
    low_stock,
    low,
    pending,
    out_of_stock,
    out,
    cancelled,
    draft,
    inactive,
    shipping,
    public,
}

export enum VisibilityEnum {
    "visible",
    "draft",
    "hidden",
}

export interface IProduct extends BaseSchema {
    name: string;
    image: IImage;
    sliderImages: IImage[];
    price: number;
    description: string;
    discountedPrice: number | null;
    isDiscount: boolean;
    quantity: number;
    color: string;
    inStock: boolean;
    category: ICategory;
    productOptions: IProductOptions[];
    colors: IColors[];
    options: IOptions[];
    productInfo: IProductInfo;
    productSpecs: IProductSpecs[];
    detailedSpecifications: IDetailedSpecifications[];
    averageRating: number;
    reviews: IReview[];
    wishlist: IWishlist[];
    slug: string;
    status: Status;
    visibility: VisibilityEnum;
}

export interface ILink extends Pick<BaseSchema, "id"> {
    url: string;
    text: string;
    isExternal: boolean;
}

export interface IUtilityLink extends Pick<BaseSchema, "id"> {
    title: string;
    links: ILink[];
}

export interface ICart extends BaseSchema {
    quantity: number;
    product: IProduct;
    user: {
        id: string;
    };
}

export interface IUser extends BaseSchema {
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    provider: string;
    avatar: IImage;
}

export interface IUserMeLoader {
    ok: boolean;
    data: IUser | null;
    error: string | null;
}

export interface IWishlist extends BaseSchema {
    user: IUser;
    product: Omit<
        IProduct,
        | "wishlist"
        | "productOptions"
        | "sliderImages"
        | "colors"
        | "options"
        | "productInfo"
        | "productSpecs"
        | "detailedSpecifications"
    >;
}

export interface IOrder extends BaseSchema {
    orderId: string;
    isSuccess: boolean | null;
    deliveryStatus: DeliveryStatus;
    estimatedDelivery: string;
    trackingNumber: string;
    cartItems: ICart[];
}
