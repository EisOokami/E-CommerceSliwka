"use server";

import qs from "qs";
import { storeRequest, StoreApiError } from "./services/client";
import { getUserMeLoader } from "./services/getUserMeLoader";
import * as adapt from "./services/adapters";
import type { DeliveryStatus } from "@/types/types";
import { storeContent } from "@/constants/storeContent";
import { CartDto, OrderDto, ProductDto, WishlistDto } from "@/interfaces/data";
import { paginationSchema } from "@/lib/schemas/schemas";

function query(
    filters: Record<string, unknown> = {},
    page = 1,
    pageSize = 8,
    sort?: string[],
) {
    const first = sort?.[0].split(":");

    paginationSchema.parse({
        page,
        pageSize,
    });

    const price = Array.isArray(filters.price) ? filters.price : [];

    const extras = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
            return (
                !["search", "category", "rating", "color", "price"].includes(
                    key,
                ) &&
                Array.isArray(value) &&
                value.length
            );
        }),
    );

    return new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters.search
            ? {
                  search: String(filters.search),
              }
            : {}),
        ...(filters.category
            ? {
                  category: String(filters.category),
              }
            : {}),
        ...(filters.rating
            ? {
                  rating: String(filters.rating),
              }
            : {}),
        ...(filters.color
            ? {
                  color: Array.isArray(filters.color)
                      ? filters.color.join(",")
                      : String(filters.color),
              }
            : {}),
        ...(Number.isFinite(Number(price[0]))
            ? {
                  minPrice: String(price[0]),
              }
            : {}),
        ...(Number.isFinite(Number(price[1]))
            ? {
                  maxPrice: String(price[1]),
              }
            : {}),
        ...(first?.[0]
            ? {
                  sort: [
                      "createdAt",
                      "name",
                      "price",
                      "finalPrice",
                      "quantity",
                      "averageRating",
                  ].includes(first[0])
                      ? first[0]
                      : "createdAt",
                  direction: first[1] === "asc" ? "asc" : "desc",
              }
            : {}),
        ...(Object.keys(extras).length
            ? {
                  options: JSON.stringify(extras),
              }
            : {}),
    }).toString();
}

export async function getAuthPageData() {
    return storeContent.auth;
}

export async function getGlobalData() {
    return {
        data: storeContent.global,
    };
}

export async function getGlobalPageMetadata() {
    return {
        data: {
            title: storeContent.global.title,
            description: storeContent.global.description,
        },
    };
}

export async function getHomePageData() {
    const [latest, rated] = await Promise.all([
        getProductsData(1, 12),
        getFilteredProductsData({}, 1, 12, ["averageRating:desc"]),
    ]);

    return {
        products: latest.products,
        topRated: rated.products.filter((product) => product.averageRating > 0),
        discounts: latest.products.filter(
            (product) =>
                product.isDiscount &&
                product.discountedPrice !== null &&
                product.discountedPrice < product.price,
        ),
    };
}

async function fetchData<T>(path: string, authenticated = false): Promise<T> {
    return storeRequest<T>(path, {
        authenticated,
    });
}

export async function getProductsData(page = 1, limit = 8) {
    return getFilteredProductsData({}, page, limit);
}

async function requireCustomer() {
    const customer = await getUserMeLoader();

    if (!customer.ok && customer.error) {
        throw new StoreApiError(401, customer.error);
    }

    return customer;
}

export async function getProductData(id: string | null, slug?: string) {
    return adapt.product(
        await fetchData<ProductDto>(
            "/api/products/by-key/" + encodeURIComponent(id ?? slug ?? ""),
        ),
    );
}

const supported = new Set([
    "createdAt",
    "name",
    "price",
    "finalPrice",
    "quantity",
    "averageRating",
    "inStock",
]);

const standardKeys = new Set([
    "search",
    "category",
    "rating",
    "price",
    "color",
]);

export async function getFilteredProductsData(
    filters: Record<string, unknown>,
    page = 1,
    limit = 8,
    sort?: string[],
) {
    const ordering = sort?.length
        ? sort
        : ["quantity:desc", "inStock:desc", "averageRating:desc", "name"];

    ordering.forEach((entry) => {
        const [field, direction = "asc"] = entry.split(":");

        if (!supported.has(field) || !["asc", "desc"].includes(direction)) {
            throw new StoreApiError(400, "Unsupported product sorting.");
        }
    });

    query(filters, page, limit);

    const hasOptions = Object.entries(filters).some(([key, value]) => {
        return (
            !standardKeys.has(key) && Array.isArray(value) && value.length > 0
        );
    });
    const hasColors = Array.isArray(filters.color)
        ? filters.color.length > 0
        : !!filters.color;

    if (!hasOptions && !hasColors) {
        const price = Array.isArray(filters.price) ? filters.price : [];
        const priceFilter = {
            ...(Number.isFinite(Number(price[0]))
                ? { $gte: Number(price[0]) }
                : {}),
            ...(Number.isFinite(Number(price[1]))
                ? { $lte: Number(price[1]) }
                : {}),
        };

        const result = await fetchData<{
            data: ProductDto[];
            productsCount: number;
            totalPages: number;
        }>(
            "/api/products/filtered?" +
                qs.stringify({
                    filters: {
                        ...(filters.search
                            ? { name: { $contains: String(filters.search) } }
                            : {}),
                        ...(filters.category
                            ? { category: { $eq: String(filters.category) } }
                            : {}),
                        ...(filters.rating !== undefined
                            ? {
                                  averageRating: {
                                      $gte: Number(filters.rating),
                                  },
                              }
                            : {}),
                        ...(Object.keys(priceFilter).length
                            ? { finalPrice: priceFilter }
                            : {}),
                    },
                    populate: { image: true, reviews: true },
                    sort: {
                        ...Object.fromEntries(
                            ordering.map((entry) => {
                                const [field, direction = "asc"] =
                                    entry.split(":");

                                return [field, direction];
                            }),
                        ),
                        id: "asc",
                    },
                    pagination: { page, pageSize: limit },
                }),
        );

        return {
            products: result.data.map(adapt.product),
            totalPages: result.totalPages,
            productsCount: result.productsCount,
        };
    }

    const compound = ordering.length > 1 || ordering[0].startsWith("inStock");
    const first = await fetchData<{
        data: ProductDto[];
        total: number;
        totalPages: number;
    }>(
        "/api/products/search?" +
            query(
                filters,
                compound ? 1 : page,
                compound ? 100 : limit,
                compound ? ["createdAt:asc"] : ordering,
            ),
    );

    if (!compound) {
        return {
            products: first.data.map(adapt.product),
            totalPages: first.totalPages,
            productsCount: first.total,
        };
    }

    query(filters, page, limit);

    const rows = [...first.data];

    for (let next = 2; next <= first.totalPages; next++) {
        const batch = await fetchData<{
            data: ProductDto[];
            total: number;
            totalPages: number;
        }>(
            "/api/products/search?" +
                query(filters, next, 100, ["createdAt:asc"]),
        );

        rows.push(...batch.data);
    }

    rows.sort((a, b) => {
        for (const entry of ordering) {
            const [field, direction = "asc"] = entry.split(":");

            const key = field as keyof ProductDto;

            const left =
                field === "finalPrice"
                    ? a.isDiscount
                        ? (a.discountedPrice ?? a.price)
                        : a.price
                    : a[key];

            const right =
                field === "finalPrice"
                    ? b.isDiscount
                        ? (b.discountedPrice ?? b.price)
                        : b.price
                    : b[key];

            const difference =
                field === "name"
                    ? String(left).localeCompare(String(right))
                    : field === "createdAt"
                      ? Date.parse(String(left)) - Date.parse(String(right))
                      : Number(left) - Number(right);

            if (difference) {
                return direction === "desc" ? -difference : difference;
            }
        }

        return a.id.localeCompare(b.id);
    });

    return {
        products: rows
            .slice((page - 1) * limit, page * limit)
            .map(adapt.product),
        totalPages: Math.ceil(first.total / limit),
        productsCount: first.total,
    };
}

export async function getFiltersByCategory(category: string | null) {
    return fetchData<{
        colors: string[];
        options: {
            title: string;
            values: string[];
        }[];
    }>(
        "/api/products/filter-options?" +
            new URLSearchParams(
                category
                    ? {
                          category,
                      }
                    : {},
            ),
    );
}

export async function getProductsPriceRange(filters: Record<string, unknown>) {
    return fetchData<{
        minPrice: number;
        maxPrice: number;
    }>(
        "/api/products/facets?" +
            query({
                ...filters,
                price: undefined,
            }),
    );
}

export async function getProductsCategory() {
    return (
        await fetchData<
            {
                id: string;
                name: string;
            }[]
        >("/api/products/categories")
    ).map((category) => ({
        category: {
            id: category.id,
            category: category.name,
        },
    }));
}

export async function getProductsCount() {
    return (
        await fetchData<{
            data: ProductDto[];
            total: number;
            totalPages: number;
        }>("/api/products/search?pageSize=1")
    ).total;
}

async function customerItems<T>(resource: "carts" | "wishlists"): Promise<T[]> {
    const rows: T[] = [];

    for (let page = 1; ; page++) {
        const batch = await fetchData<T[]>(
            "/api/" +
                resource +
                "?" +
                qs.stringify({
                    populate: {
                        product: {
                            populate: {
                                image: true,
                            },
                        },
                    },
                    sort: {
                        id: "asc",
                    },
                    pagination: {
                        page,
                        pageSize: 100,
                    },
                }),
            true,
        );

        rows.push(...batch);

        if (batch.length < 100) {
            return rows;
        }
    }
}

export async function getCartProductsData() {
    if (!(await requireCustomer()).ok) {
        return [];
    }

    const rows = await customerItems<CartDto>("carts");

    return rows.map(adapt.cart);
}

export async function getCartProductData(id: string) {
    return (await getCartProductsData()).find((product) => {
        return product.id === id;
    });
}

export async function getCartProductDataByProductDocumentId(id: string) {
    return (await getCartProductsData()).find((product) => {
        return product.product.id === id;
    });
}

export async function getProductsBySearchData(searchValue: string) {
    const result = await fetchData<{
        data: ProductDto[];
    }>(
        "/api/products/filtered?" +
            qs.stringify({
                filters: {
                    $or: [
                        {
                            name: {
                                $contains: searchValue,
                            },
                        },
                        {
                            category: {
                                $contains: searchValue,
                            },
                        },
                    ],
                },
                populate: {
                    image: true,
                },
                sort: {
                    name: "asc",
                    id: "asc",
                },
                pagination: {
                    page: 1,
                    pageSize: 20,
                },
            }),
    );

    return result.data.map(adapt.product);
}

export async function getWishlistProductsData() {
    const owner = await requireCustomer();

    if (!owner.ok) {
        return [];
    }

    const rows = await customerItems<WishlistDto>("wishlists");

    return rows.map((row) => {
        return adapt.wishlist(row, owner.data);
    });
}

export async function getWishlistProductData(id: string) {
    return (await getWishlistProductsData()).find((wishlistProduct) => {
        return wishlistProduct.product.id === id;
    });
}

export async function getProductsInCartCount() {
    return (await getCartProductsData()).length;
}

export async function getProductsInWishlistCount() {
    return (await getWishlistProductsData()).length;
}

export async function getOrdersData(
    page = 1,
    limit = 8,
    status?: DeliveryStatus | "All",
) {
    if (!(await requireCustomer()).ok) {
        return undefined;
    }

    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(limit),
        ...(status && status !== "All"
            ? {
                  status,
              }
            : {}),
    });

    const result = await fetchData<{
        data: (Omit<OrderDto, "cartItems"> & {
            cartItems: {
                id: string;
                quantity: number;
                user: {
                    id: string;
                };
                product: ProductDto;
            }[];
        })[];
        totalPages: number;
    }>("/api/orders/history?" + params, true);

    return {
        totalPages: result.totalPages,
        data: result.data.map((row) => {
            return adapt.order(
                row,
                row.cartItems.map((item) => ({
                    id: item.id,
                    createdAt: new Date(row.createdAt),
                    updatedAt: new Date(row.updatedAt),
                    quantity: item.quantity,
                    user: {
                        id: item.user.id,
                    },
                    product: adapt.product(item.product),
                })),
            );
        }),
    };
}

export async function getReviewsData(id: string) {
    return (await getProductData(id)).reviews;
}

export async function getAllOrdersData() {
    const result = await getOrdersData(1, 100);

    if (!result) {
        return undefined;
    }

    const data = [...result.data];

    for (let page = 2; page <= result.totalPages; page++) {
        const next = await getOrdersData(page, 100);

        if (!next) {
            throw new StoreApiError(401, "Please sign in.");
        }

        data.push(...next.data);
    }

    return {
        data,
        totalPages: result.totalPages,
    };
}
