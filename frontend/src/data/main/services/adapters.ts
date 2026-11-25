import {
    CartDto,
    OrderDto,
    ProductDto,
    ReviewDto,
    UserDto,
    WishlistDto,
} from "@/interfaces/data";
import type {
    IProduct,
    IReview,
    ICart,
    IWishlist,
    IUser,
    IOrder,
} from "@/interfaces/interfaces";
import { Status, VisibilityEnum } from "@/interfaces/interfaces";
import { mediaUrl } from "@/lib/utils";

export function review(data: ReviewDto): IReview {
    return {
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        description: data.description,
        rating: data.rating,
        publicationDate: data.publicationDate,
        lastEdited: data.lastEdited,
        images: (data.files ?? []).map((file) => ({
            id: file.id,
            url: file.fileUrl.startsWith("/files/")
                ? "/media" + file.fileUrl
                : file.fileUrl,
            alternativeText: file.filename ?? null,
        })),
        user: {
            id: data.userId,
            username: data.user?.username ?? "Customer",
            avatar: {
                id: data.userId,
                url: data.user?.avatarUrl
                    ? mediaUrl(data.user.avatarUrl)
                    : "/avatar.png",
                alternativeText: "Avatar",
            },
        },
        product: {
            id: data.productId,
        },
    };
}

export function product(data: ProductDto): IProduct {
    return {
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        name: data.name,
        description: data.description,
        price: Number(data.price),
        discountedPrice:
            data.discountedPrice === null ? null : Number(data.discountedPrice),
        isDiscount: data.isDiscount,
        quantity: data.quantity,
        inStock: data.inStock,
        color: data.color,
        category: {
            id: data.category,
            category: data.category,
        },
        slug: data.slug,
        averageRating: Number(data.averageRating),
        image: {
            id: data.image.id,
            url: data.image.fileUrl.startsWith("/files/")
                ? "/media" + data.image.fileUrl
                : data.image.fileUrl,
            alternativeText: data.image.filename ?? null,
        },
        sliderImages: [
            data.image,
            ...(data.sliderImages ?? []).filter((item) => {
                return item.id !== data.image.id;
            }),
        ].map((file) => ({
            id: file.id,
            url: file.fileUrl.startsWith("/files/")
                ? "/media" + file.fileUrl
                : file.fileUrl,
            alternativeText: file.filename ?? null,
        })),
        colors: (data.productVariants ?? []).map((color) => ({
            id: color.id,
            colorName: color.name,
            colorHex: color.hex,
            productSlug: color.productSlug ?? data.slug,
            inStock: color.inStock,
        })),
        options: (data.options ?? []).map((option) => {
            return {
                id: option.id,
                title: option.title,
                optionsArray: option.optionDetails.map((optionDetail) => ({
                    id: optionDetail.id,
                    optionName: optionDetail.name,
                    productSlug: optionDetail.productSlug ?? data.slug,
                    inStore: optionDetail.inStock,
                })),
            };
        }),
        productOptions: (data.options ?? []).flatMap((option) => {
            return option.optionDetails.map((optionDetail) => ({
                id: optionDetail.id,
                optionType: option.title,
                optionName: optionDetail.name,
            }));
        }),
        productInfo: {
            id: data.productInfos?.[0].id ?? data.id,
            delivery: data.productInfos?.[0].delivery ?? "",
            inStore: data.productInfos?.[0].inStore ?? "",
            guaranteed: data.productInfos?.[0].guaranteed ?? "",
        },
        productSpecs: data.productSpecifications ?? [],
        detailedSpecifications: (data.productSpecificationGroups ?? []).map(
            (productSpecificationGroup) => ({
                id: productSpecificationGroup.id,
                name: productSpecificationGroup.name,
                specifications: productSpecificationGroup.specifications.map(
                    (specification) => ({
                        id: specification.id,
                        name: specification.name,
                        specifications: [
                            {
                                id: specification.id,
                                item: specification.description ?? "",
                            },
                        ],
                    }),
                ),
            }),
        ),
        reviews: (data.reviews ?? []).map(review),
        wishlist: [],
        status: data.visibility === "visible" ? Status.active : Status.draft,
        visibility:
            data.visibility === "visible"
                ? VisibilityEnum.visible
                : data.visibility === "draft"
                  ? VisibilityEnum.draft
                  : VisibilityEnum.hidden,
    };
}

export function cart(data: CartDto): ICart {
    return {
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        quantity: data.quantity,
        product: product(data.product),
        user: {
            id: data.userId,
        },
    };
}

export function user(data: UserDto): IUser {
    return {
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        username: data.username,
        email: data.email,
        confirmed: data.confirmed,
        blocked: data.blocked,
        provider: data.authProvider,
        hasPassword: data.hasPassword ?? data.authProvider !== "google",
        requiresTermsAcceptance: data.requiresTermsAcceptance === true,
        avatar: {
            id: data.id,
            url: data.avatarUrl ? mediaUrl(data.avatarUrl) : "/avatar.png",
            alternativeText: "Avatar",
        },
    };
}

export function wishlist(data: WishlistDto, owner: IUser): IWishlist {
    return {
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        user: owner,
        product: product(data.product),
    };
}

export function order(data: OrderDto, items: ICart[]): IOrder {
    return {
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        orderId: data.orderId,
        isSuccess: data.isSuccess,
        deliveryStatus: data.deliveryStatus,
        estimatedDelivery: data.estimatedDelivery ?? "",
        trackingNumber: data.trackingNumber ?? "",
        cartItems: items,
    };
}
