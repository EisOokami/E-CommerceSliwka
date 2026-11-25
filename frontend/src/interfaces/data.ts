import { DeliveryStatus } from "@/types/types";

export interface IDetailsError {
    path: string;
    message: string;
    name: string;
    value: string;
}

export interface IApiErrorContent {
    status: number;
    name: string;
    message: string;
    details: {
        errors: IDetailsError[];
    };
}

export interface IRestError {
    data: null;
    error: IApiErrorContent;
}

export interface IBaseZodErrors {
    [key: string]: string[] | undefined;
}

export interface IBaseAction {
    zodErrors: IBaseZodErrors | null;
    strapiErrors: IRestError["error"] | null;
    message: string | null;
    strapiErrorsDetails: IDetailsError[] | null;
    formData: FormData | null;
}

export interface IRegisterZodErrors extends IBaseZodErrors {
    username?: string[];
    email?: string[];
    password?: string[];
    agreeToTermsAndPrivacy?: string[];
}

export interface ILoginZodErrors extends IBaseZodErrors {
    identifier?: string[];
    password?: string[];
}

export interface IReviewZodErrors extends IBaseZodErrors {
    description?: string[];
    rating?: string[];
    images?: string[];
}

export interface IUpdateProfileZodErrors extends IBaseZodErrors {
    username?: string[];
    email?: string[];
    avatar?: string[];
    currentPassword?: string[];
}

export interface IChangePasswordZodErrors extends IBaseZodErrors {
    password?: string[];
    currentPassword?: string[];
    confirmPassword?: string[];
    confirmCurrentPassword?: string[];
}

export interface IRegisterAction extends IBaseAction {
    zodErrors: IRegisterZodErrors | null;
}

export interface ILoginAction extends IBaseAction {
    requiresMfa?: boolean;
    requiresTermsAcceptance?: boolean;
    zodErrors: ILoginZodErrors | null;
}

export interface IAddReviewAction extends IBaseAction {
    zodErrors: IReviewZodErrors | null;
}

export interface IEditReviewAction extends IBaseAction {
    zodErrors: IReviewZodErrors | null;
}

export interface IUpdateProfileAction extends IBaseAction {
    data: {
        username: FormDataEntryValue | null;
        email: FormDataEntryValue | null;
        avatar?: string[] | null;
    } | null;
    zodErrors: IUpdateProfileZodErrors | null;
}

export interface IDeleteAccountZodErrors extends IBaseZodErrors {
    password?: string[];
    code?: string[];
    confirm?: string[];
}

export interface IDeleteAccountAction extends IBaseAction {
    codeSent?: boolean;
    zodErrors: IDeleteAccountZodErrors | null;
}

export interface IChangePasswordAction extends IBaseAction {
    data: {
        currentPassword?: FormDataEntryValue | null;
        password?: FormDataEntryValue | null;
        passwordConfirmation?: FormDataEntryValue | null;
    } | null;
    zodErrors: IChangePasswordZodErrors | null;
}

export interface BaseZodErrors {
    [key: string]: string[] | undefined;
}

export interface DetailsError {
    field: string;
    message: string;
}

export interface BaseAction {
    zodErrors: BaseZodErrors | null;
    status: "error" | "message" | "success" | null;
    message: string | null;
    error: string | null;
    details: DetailsError[] | null;
    formData: FormData | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

export interface BaseDto {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileDto extends Partial<BaseDto> {
    id: string;
    fileUrl: string;
    filename?: string;
    imageRole?: string;
    sortOrder?: number;
}

export interface ReviewDto extends BaseDto {
    description: string;
    rating: number;
    publicationDate: string;
    lastEdited: string | null;
    productId: string;
    userId: string;
    user?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    files?: FileDto[];
}

export interface ProductDto extends BaseDto {
    name: string;
    description: string;
    price: string;
    discountedPrice: string | null;
    isDiscount: boolean;
    quantity: number;
    inStock: boolean;
    color: string;
    category: string;
    slug: string;
    averageRating: string;
    visibility: "visible" | "draft" | "hidden";
    image: FileDto;
    sliderImages?: FileDto[];
    productVariants?: {
        id: string;
        name: string;
        hex: string;
        productSlug: string | null;
        inStock: boolean;
    }[];
    options?: {
        id: string;
        title: string;
        optionDetails: {
            id: string;
            name: string;
            productSlug: string | null;
            inStock: boolean;
        }[];
    }[];
    productInfos?: {
        id: string;
        delivery: string;
        inStore: string;
        guaranteed: string;
    }[];
    productSpecifications?: {
        id: string;
        name: string;
        specification: string;
        icon: string;
    }[];
    productSpecificationGroups?: {
        id: string;
        name: string;
        specifications: {
            id: string;
            name: string;
            description: string | null;
        }[];
    }[];
    reviews?: ReviewDto[];
}

export interface CartDto extends BaseDto {
    quantity: number;
    userId: string;
    productId: string;
    product: ProductDto;
}

export interface WishlistDto extends BaseDto {
    userId: string;
    product: ProductDto;
}

export interface UserDto extends BaseDto {
    username: string;
    email: string;
    avatarUrl: string | null;
    confirmed: boolean;
    blocked: boolean;
    authProvider: string;
    hasPassword?: boolean;
    requiresTermsAcceptance?: boolean;
}

export interface OrderDto extends BaseDto {
    orderId: string;
    isSuccess: boolean | null;
    deliveryStatus: DeliveryStatus;
    estimatedDelivery: string | null;
    trackingNumber: string | null;
    cartItems: {
        id: string;
        quantity: number;
        product: {
            id: string;
        };
        user: {
            id: string;
        };
    }[];
}

export interface AuthResponse {
    message: string;
    accessToken?: string;
    refreshToken?: string;
    requiresMfa?: boolean;
    tempToken?: string;
}

export interface RequestOptions {
    method?: string;
    body?: unknown;
    authenticated?: boolean;
}

export interface ApiFieldError {
    field: string;
    message: string;
}
