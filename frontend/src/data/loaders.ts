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
                            link: {
                                populate: true,
                            },
                        },
                    },
                    "layout.feature-products-section": {
                        populate: {
                            featureproduct: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    link: {
                                        populate: true,
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
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
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
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            user: {
                                                populate: "*",
                                            },
                                            product: {
                                                populate: "*",
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                    wishlist: {
                                        populate: "*",
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
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
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
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            user: {
                                                populate: "*",
                                            },
                                            product: {
                                                populate: "*",
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
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
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
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
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            user: {
                                                populate: "*",
                                            },
                                            product: {
                                                populate: "*",
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                    wishlist: {
                                        populate: "*",
                                    },
                                },
                            },
                            bestseller: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
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
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            user: {
                                                populate: "*",
                                            },
                                            product: {
                                                populate: "*",
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                    wishlist: {
                                        populate: "*",
                                    },
                                },
                            },
                            featuredProducts: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
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
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            user: {
                                                populate: "*",
                                            },
                                            product: {
                                                populate: "*",
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                    wishlist: {
                                        populate: "*",
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

export async function getProductProductsData(
    page: number = 1,
    limit: number = 8,
) {
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
                populate: true,
            },
            options: {
                populate: true,
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
                        populate: "*",
                    },
                    product: {
                        populate: "*",
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

export async function getProductProductData(documentId: string) {
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
                populate: true,
            },
            options: {
                populate: true,
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
                        populate: "*",
                    },
                    product: {
                        populate: "*",
                    },
                    images: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
        },
        filters: {
            documentId: {
                $eq: documentId,
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data[0];
}

export async function getFilteredProductsData(
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
        ...(category && { category: { category: { $eq: category } } }),
        ...(colors &&
            colors.length > 0 && { colors: { item: { $in: colors } } }),
        ...(options &&
            options.length > 0 && { options: { item: { $in: options } } }),
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
                    populate: true,
                },
                options: {
                    populate: true,
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
                            populate: "*",
                        },
                        product: {
                            populate: "*",
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
            },
            options: {
                populate: true,
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
    category: string | null,
    colors: string[] | null,
    options: string[] | null,
    rating: number | null,
) {
    const url = new URL("/api/products/price-range", baseUrl);

    const filters = {
        ...(category && { category: { category: { $eq: category } } }),
        ...(colors &&
            colors.length > 0 && { colors: { item: { $in: colors } } }),
        ...(options &&
            options.length > 0 && { options: { item: { $in: options } } }),
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
    const url = new URL("/api/carts", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: "*",
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

export async function getCartProductData(documentId: string) {
    const user = await getUserMeLoader();
    const url = new URL("/api/carts", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: "*",
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
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getProductsBySearchData(searchValue: string) {
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
                populate: true,
            },
            options: {
                populate: true,
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
                        populate: "*",
                    },
                    product: {
                        populate: "*",
                    },
                    images: {
                        fields: ["url", "alternativeText"],
                    },
                },
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
    const url = new URL("/api/wishlists", baseUrl);

    url.search = qs.stringify({
        populate: {
            product: {
                populate: "*",
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
