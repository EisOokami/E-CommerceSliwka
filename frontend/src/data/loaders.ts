"use server";

import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/getToken";
import { getUserMeLoader } from "./services/getUserMeLoader";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
    const authToken = await getAuthToken();

    const headers = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    };

    try {
        const response = await fetch(url, authToken ? headers : {});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function getAuthPageData() {
    const url = new URL("/api/auth-page", baseUrl);

    url.search = qs.stringify({
        populate: {
            blocks: {
                on: {
                    "layout.sign-in": {
                        populate: {
                            banner: {
                                fields: ["url", "alternativeText"],
                            },
                            link: {
                                populate: true,
                            },
                        },
                    },
                    "layout.sign-up": {
                        populate: {
                            banner: {
                                fields: ["url", "alternativeText"],
                            },
                            link: {
                                populate: true,
                            },
                        },
                    },
                },
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return {
        signIn: fetchedData.data.blocks[0],
        signUp: fetchedData.data.blocks[1],
    };
}

export async function getHomePageData() {
    const url = new URL("/api/home-page", baseUrl);

    url.search = qs.stringify({
        populate: {
            blocks: {
                on: {
                    "layout.hero-section": {
                        populate: {
                            image: {
                                fields: ["url", "alternativeText"],
                            },
                            product: {
                                fields: ["slug", "name"],
                            },
                        },
                    },
                    "layout.feature-products-section": {
                        populate: {
                            featureProduct: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    product: {
                                        fields: ["slug"],
                                    },
                                },
                            },
                        },
                    },
                    "layout.discounts": {
                        populate: {
                            products: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    reviews: {
                                        fields: ["documentId"],
                                    },
                                },
                            },
                        },
                    },
                    "layout.products-carousel-section": {
                        populate: {
                            products: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    reviews: {
                                        fields: ["documentId"],
                                    },
                                },
                            },
                        },
                    },
                    "layout.products-section": {
                        populate: {
                            categories: {
                                populate: true,
                            },
                            tabs: {
                                populate: true,
                            },
                            newArrival: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    reviews: {
                                        fields: ["documentId"],
                                    },
                                },
                            },
                            bestseller: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    reviews: {
                                        fields: ["documentId"],
                                    },
                                },
                            },
                            featuredProducts: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    reviews: {
                                        fields: ["documentId"],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return await fetchData(url.href);
}

export async function getGlobalData() {
    const url = new URL("/api/global", baseUrl);

    url.search = qs.stringify({
        populate: {
            header: {
                populate: [
                    "logoLink",
                    "navigationLinks",
                    "iconsLink",
                    "logoImage",
                ],
            },
            footer: {
                populate: {
                    logoLink: true,
                    socialLinks: true,
                    utilityLinks: {
                        populate: "links",
                    },
                    logoImage: true,
                },
            },
        },
    });

    return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
    const url = new URL("/api/global", baseUrl);

    url.search = qs.stringify({
        fields: ["title", "description"],
    });

    return await fetchData(url.href);
}

export async function getProductsData(page: number = 1, limit: number = 8) {
    const url = new URL("/api/products", baseUrl);

    url.search = qs.stringify({
        populate: {
            image: {
                fields: ["url", "alternativeText"],
            },
            sliderImages: {
                fields: ["url", "alternativeText"],
            },
            colors: {
                populate: {
                    sliderImages: {
                        fields: ["url", "alternativeText"],
                    },
                },
                sort: "priceDifference:asc",
            },
            options: {
                populate: true,
                sort: "priceDifference:asc",
            },
            productInfo: {
                populate: true,
            },
            productSpecs: {
                populate: true,
            },
            category: {
                populate: true,
            },
            detailedSpecifications: {
                populate: {
                    specifications: {
                        populate: {
                            specifications: {
                                populate: true,
                            },
                        },
                    },
                },
            },
            reviews: {
                populate: {
                    user: {
                        populate: {
                            avatar: {
                                fields: ["url", "alternativeText"],
                            },
                        },
                        fields: ["username"],
                    },
                    product: {
                        fields: ["documentId"],
                    },
                    images: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
        },
        pagination: {
            page,
            pageSize: limit,
        },
    });

    const fetchedData = await fetchData(url.href);

    return {
        products: fetchedData.data,
        totalPages: fetchedData.meta.pagination.pageCount,
    };
}

export async function getProductData(documentId: string | null, slug?: string) {
    const url = new URL("/api/products", baseUrl);

    const filters = {
        ...(documentId && { documentId: { $eq: documentId } }),
        ...(slug && { slug: { $eq: slug } }),
    };

    url.search = qs.stringify({
        populate: {
            image: {
                fields: ["url", "alternativeText"],
            },
            sliderImages: {
                fields: ["url", "alternativeText"],
            },
            colors: {
                populate: {
                    sliderImages: {
                        fields: ["url", "alternativeText"],
                    },
                },
                sort: "priceDifference:asc",
            },
            options: {
                populate: true,
                sort: "priceDifference:asc",
            },
            productInfo: {
                populate: true,
            },
            productSpecs: {
                populate: true,
            },
            category: {
                populate: true,
            },
            detailedSpecifications: {
                populate: {
                    specifications: {
                        populate: {
                            specifications: {
                                populate: true,
                            },
                        },
                    },
                },
            },
            reviews: {
                populate: {
                    user: {
                        populate: {
                            avatar: {
                                fields: ["url", "alternativeText"],
                            },
                        },
                        fields: ["username"],
                    },
                    product: {
                        fields: ["documentId"],
                    },
                    images: {
                        fields: ["url", "alternativeText"],
                    },
                },
                sort: "createdAt:desc",
            },
        },
        filters,
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data[0];
}

export async function getFilteredProductsData(
    search: string | null,
    category: string | null,
    price: number[] | null,
    colors: string[] | null,
    options: string[] | null,
    rating: number | null,
    page: number = 1,
    limit: number = 8,
) {
    const url = new URL("/api/products/filtered", baseUrl);

    const filters = {
        ...(search && { name: { $containsi: search } }),
        ...(category && { category: { category: { $eq: category } } }),
        ...(colors &&
            colors.length > 0 && { colors: { colorName: { $eq: colors } } }),
        ...(options &&
            options.length > 0 && { options: { value: { $eq: options } } }),
        ...(rating && { averageRating: { $gte: rating } }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams: Record<string, any> = {
        ...(price && { price: price }),
    };

    url.search = qs.stringify(
        {
            populate: {
                image: {
                    fields: ["url", "alternativeText"],
                },
                sliderImages: {
                    fields: ["url", "alternativeText"],
                },
                colors: {
                    populate: {
                        sliderImages: {
                            fields: ["url", "alternativeText"],
                        },
                    },
                    sort: "priceDifference:asc",
                },
                options: {
                    populate: true,
                    sort: "priceDifference:asc",
                },
                productInfo: {
                    populate: true,
                },
                productSpecs: {
                    populate: true,
                },
                category: {
                    populate: true,
                },
                detailedSpecifications: {
                    populate: {
                        specifications: {
                            populate: {
                                specifications: {
                                    populate: true,
                                },
                            },
                        },
                    },
                },
                reviews: {
                    populate: {
                        user: {
                            populate: {
                                avatar: {
                                    fields: ["url", "alternativeText"],
                                },
                            },
                            fields: ["username"],
                        },
                        product: {
                            fields: ["documentId"],
                        },
                        images: {
                            fields: ["url", "alternativeText"],
                        },
                    },
                },
            },
            filters,
            queryParams,
            pagination: {
                page,
                pageSize: limit,
            },
        },
        { encodeValuesOnly: true },
    );

    const fetchedData = await fetchData(url.href);

    return {
        products: fetchedData.data,
        totalPages: fetchedData.totalPages,
        productsCount: fetchedData.productsCount,
    };
}

export async function getFiltersByCategory(category: string | null) {
    const url = new URL("/api/products", baseUrl);

    const filters = {
        ...(category && { category: { category: { $eq: category } } }),
    };

    url.search = qs.stringify({
        populate: {
            colors: {
                populate: true,
                sort: "priceDifference:asc",
            },
            options: {
                populate: true,
                sort: "priceDifference:asc",
            },
            category: {
                populate: true,
            },
        },
        filters,
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getProductsPriceRange(
    search: string | null,
    category: string | null,
    colors: string[] | null,
    options: string[] | null,
    rating: number | null,
) {
    const url = new URL("/api/products/price-range", baseUrl);

    const filters = {
        ...(search && { name: { $containsi: search } }),
        ...(category && { category: { category: { $eq: category } } }),
        ...(colors &&
            colors.length > 0 && { colors: { colorName: { $eq: colors } } }),
        ...(options &&
            options.length > 0 && { options: { value: { $eq: options } } }),
        ...(rating && { averageRating: { $gte: rating } }),
    };

    url.search = qs.stringify({ filters }, { encodeValuesOnly: true });

    const { minPrice, maxPrice } = await fetchData(url.href);

    return { minPrice, maxPrice };
}

export async function getProductsCategory() {
    const url = new URL("/api/products", baseUrl);

    url.search = qs.stringify({
        populate: {
            category: {
                populate: true,
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getProductsCount() {
    const url = new URL("/api/products/products-count", baseUrl);

    url.search = qs.stringify({
        populate: "*",
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getCartProductsData() {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return [];
    }

    const url = new URL("/api/carts", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: {
                    image: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
            user: {
                populate: true,
            },
            option: {
                populate: true,
            },
            color: {
                populate: true,
            },
        },
        sort: ["createdAt:asc"],
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getCartProductData(cartDocumentId: string) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return;
    }

    const url = new URL(`/api/carts/${cartDocumentId}`, baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: {
                    image: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
            option: {
                populate: true,
            },
            color: {
                populate: true,
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getCartProductByProductDocumentIdData(
    productDocumentId: string,
    optionDocumentId?: string,
    colorDocumentId?: string,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return;
    }

    const url = new URL("/api/carts", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: {
                    image: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
            user: {
                fields: ["id"],
            },
            option: {
                populate: true,
            },
            color: {
                populate: true,
            },
        },
        filters: {
            product: {
                documentId: {
                    $eq: productDocumentId,
                },
            },
            ...(optionDocumentId && {
                option: {
                    documentId: {
                        $eq: optionDocumentId,
                    },
                },
            }),
            ...(colorDocumentId && {
                color: {
                    documentId: {
                        $eq: colorDocumentId,
                    },
                },
            }),
            user: {
                id: {
                    $eq: user.data.id,
                },
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data[0];
}

export async function getProductsBySearchData(searchValue: string) {
    const url = new URL("/api/products", baseUrl);

    url.search = qs.stringify({
        populate: {
            image: {
                fields: ["url", "alternativeText"],
            },
            category: {
                populate: true,
            },
        },
        filters: {
            $or: [
                {
                    name: {
                        $containsi: searchValue,
                    },
                },
                {
                    category: {
                        category: {
                            $containsi: searchValue,
                        },
                    },
                },
            ],
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getWishlistProductsData() {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return [];
    }

    const url = new URL("/api/wishlists", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: {
                    image: {
                        fields: ["url", "alternativeText"],
                    },
                    category: {
                        populate: true,
                    },
                },
            },
            user: {
                fields: ["id"],
            },
        },
        filters: {
            user: {
                id: {
                    $eq: user.data.id,
                },
            },
        },
        sort: ["createdAt:asc"],
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getWishlistProductData(documentId: string) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return undefined;
    }

    const url = new URL("/api/wishlists", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: {
                    image: {
                        fields: ["url", "alternativeText"],
                    },
                    category: {
                        populate: true,
                    },
                },
            },
            user: {
                fields: ["id"],
            },
        },
        filters: {
            product: {
                documentId: {
                    $eq: documentId,
                },
            },
            user: {
                id: {
                    $eq: user.data.id,
                },
            },
        },
        sort: ["createdAt:asc"],
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data[0];
}

export async function getProductsInCartCount() {
    const url = new URL("/api/carts/carts-count", baseUrl);

    url.search = qs.stringify({
        populate: "*",
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getProductsInWishlistCount() {
    const url = new URL("/api/wishlists/wishlists-count", baseUrl);

    url.search = qs.stringify({
        populate: "*",
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getOrdersData() {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return undefined;
    }

    const url = new URL("/api/orders", baseUrl);

    url.search = qs.stringify({
        fields: [
            "orderId",
            "isSuccess",
            "deliveryStatus",
            "estimatedDelivery",
            "trackingNumber",
            "cartItems",
        ],
        filters: {
            user: {
                id: {
                    $eq: user.data.id,
                },
            },
        },
        sort: ["createdAt:desc"],
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getReviewsData(productDocumentId: string) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        return undefined;
    }

    const url = new URL("/api/reviews", baseUrl);

    url.search = qs.stringify({
        populate: {
            user: {
                populate: {
                    avatar: {
                        fields: ["url", "alternativeText"],
                    },
                },
                fields: ["username"],
            },
            product: {
                fields: ["documentId"],
            },
            images: {
                fields: ["url", "alternativeText"],
            },
        },
        filters: {
            product: {
                documentId: {
                    $eq: productDocumentId,
                },
            },
        },
        sort: ["createdAt:desc"],
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}
