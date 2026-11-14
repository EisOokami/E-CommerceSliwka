import {
    and,
    count,
    eq,
    sql,
    asc,
    desc,
    gte,
    ilike,
    inArray,
    lte,
} from "drizzle-orm";
import { db } from "../db/index.js";
import { productsQuery } from "../query/products.query.js";
import { type QueryInput } from "../types/query.js";
import { buildQuery } from "../utils/query/queryBuilder.js";
import {
    categories,
    files,
    optionDetails,
    options,
    products,
    productVariants,
    reviews,
} from "../db/schema.js";
import { ApiError } from "../utils/apiError.js";
import type { ProductSearch } from "../validators/products.js";

type ProductQuery = QueryInput<typeof productsQuery.config>;

export const getProducts = async (query: ProductQuery) => {
    const args = buildQuery(query, productsQuery);
    const reviewOptions = args.with ? args.with.reviews : undefined;

    if (reviewOptions) {
        args.with = {
            ...args.with,
            reviews: {
                ...(reviewOptions === true ? {} : reviewOptions),
                where: eq(reviews.visible, true),
            },
        };
    }

    const productsData = await db.query.products.findMany({
        ...args,
        where: and(args.where, eq(products.visibility, "visible")),
    });

    return productsData;
};

export const getFilteredProducts = async (query: ProductQuery) => {
    const args = buildQuery(query, productsQuery);
    const reviewOptions = args.with ? args.with.reviews : undefined;

    if (reviewOptions) {
        args.with = {
            ...args.with,
            reviews: {
                ...(reviewOptions === true ? {} : reviewOptions),
                where: eq(reviews.visible, true),
            },
        };
    }

    const updatedArgs = {
        ...args,
        where: and(args.where, eq(products.visibility, "visible")),
    };

    const [rows, totals] = await Promise.all([
        db.query.products.findMany(updatedArgs),
        db.select({ total: count() }).from(products).where(updatedArgs.where),
    ]);

    const productsCount = totals[0] ? totals[0].total : 0;

    return {
        data: rows,
        productsCount,
        totalPages: Math.ceil(productsCount / updatedArgs.limit),
    };
};

export const getPriceRange = async (query: ProductQuery) => {
    const args = buildQuery(query, productsQuery);
    const reviewOptions = args.with ? args.with.reviews : undefined;

    if (reviewOptions) {
        args.with = {
            ...args.with,
            reviews: {
                ...(reviewOptions === true ? {} : reviewOptions),
                where: eq(reviews.visible, true),
            },
        };
    }

    const updatedArgs = {
        ...args,
        where: and(args.where, eq(products.visibility, "visible")),
    };

    const [range] = await db
        .select({
            minPrice: sql<string>`coalesce(min(case when ${products.isDiscount} then coalesce(${products.discountedPrice}, ${products.price}) else ${products.price} end), 0)`,
            maxPrice: sql<string>`coalesce(max(case when ${products.isDiscount} then coalesce(${products.discountedPrice}, ${products.price}) else ${products.price} end), 0)`,
        })
        .from(products)
        .where(updatedArgs.where);

    return {
        minPrice: range ? +range.minPrice : 0,
        maxPrice: range ? +range.maxPrice : 0,
    };
};

export const getProductsCount = async () => {
    const productsCount = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.visibility, "visible"));

    return {
        data: productsCount,
    };
};

export const searchProducts = async (query: ProductSearch) => {
    const where = and(
        eq(products.visibility, "visible"),
        query.search
            ? ilike(
                  products.name,
                  "%" + query.search.replace(/[\\%_]/g, "\\$&") + "%",
              )
            : undefined,
        query.category ? eq(products.category, query.category) : undefined,
        query.rating !== undefined
            ? gte(products.averageRating, String(query.rating))
            : undefined,
        query.minPrice !== undefined
            ? gte(products.finalPrice, String(query.minPrice))
            : undefined,
        query.maxPrice !== undefined
            ? lte(products.finalPrice, String(query.maxPrice))
            : undefined,
        query.color
            ? sql`exists(select 1 from product_variants where product_id=${products.id} and ${inArray(sql`name`, query.color.split(","))})`
            : undefined,
        ...Object.entries(query.options).map(([title, values]) =>
            values.length
                ? sql`exists(select 1 from options o join option_details d on d.option_id=o.id where o.product_id=${products.id} and lower(o.title)=lower(${title}) and ${inArray(sql`d.name`, values)})`
                : undefined,
        ),
    );

    const [data, [count]] = await Promise.all([
        db.query.products.findMany({
            where,
            with: {
                image: true,
                sliderImages: { orderBy: asc(files.sortOrder) },
                productVariants: true,
                options: { with: { optionDetails: true } },
                productInfos: true,
                productSpecifications: true,
                productSpecificationGroups: { with: { specifications: true } },
                reviews: {
                    where: eq(reviews.visible, true),
                    with: {
                        user: {
                            columns: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                            },
                        },
                        files: true,
                    },
                },
            },
            orderBy: [
                (query.direction === "asc" ? asc : desc)(products[query.sort]),
                asc(products.id),
            ],
            limit: query.pageSize,
            offset: (query.page - 1) * query.pageSize,
        }),
        db
            .select({ total: sql<number>`count(*)::int` })
            .from(products)
            .where(where),
    ]);

    if (!count) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to count products",
        });
    }

    return {
        data,
        total: count.total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(count.total / query.pageSize),
    };
};

export const productFacets = async (query: ProductSearch) => {
    const [range] = await db
        .select({
            minPrice: sql<string>`coalesce(min(${products.finalPrice}),0)`,
            maxPrice: sql<string>`coalesce(max(${products.finalPrice}),0)`,
        })
        .from(products)
        .where(
            and(
                eq(products.visibility, "visible"),
                query.search
                    ? ilike(
                          products.name,
                          "%" + query.search.replace(/[\\%_]/g, "\\$&") + "%",
                      )
                    : undefined,
                query.category
                    ? eq(products.category, query.category)
                    : undefined,
                query.rating !== undefined
                    ? gte(products.averageRating, String(query.rating))
                    : undefined,
                query.color
                    ? sql`exists(select 1 from product_variants where product_id=${products.id} and ${inArray(sql`name`, query.color.split(","))})`
                    : undefined,
                ...Object.entries(query.options).map(([title, values]) =>
                    values.length
                        ? sql`exists(select 1 from options o join option_details d on d.option_id=o.id where o.product_id=${products.id} and lower(o.title)=lower(${title}) and ${inArray(sql`d.name`, values)})`
                        : undefined,
                ),
            ),
        );

    if (!range) {
        throw new ApiError({
            statusCode: 500,
            message: "Failed to load product price range",
        });
    }

    return {
        minPrice: Number(range.minPrice),
        maxPrice: Number(range.maxPrice),
    };
};

export const publicCategories = async () => {
    return await db.query.categories.findMany({
        orderBy: asc(categories.name),
    });
};

export const categoryFilters = async (category?: string) => {
    const where = and(
        eq(products.visibility, "visible"),
        category ? eq(products.category, category) : undefined,
    );
    const [colors, choices] = await Promise.all([
        db
            .selectDistinct({ name: productVariants.name })
            .from(productVariants)
            .innerJoin(products, eq(productVariants.productId, products.id))
            .where(where)
            .orderBy(asc(productVariants.name)),
        db
            .selectDistinct({ title: options.title, name: optionDetails.name })
            .from(options)
            .innerJoin(products, eq(options.productId, products.id))
            .innerJoin(optionDetails, eq(optionDetails.optionId, options.id))
            .where(where)
            .orderBy(asc(options.title), asc(optionDetails.name)),
    ]);

    const grouped = new Map<string, string[]>();

    for (const choice of choices) {
        grouped.set(choice.title, [
            ...(grouped.get(choice.title) ?? []),
            choice.name,
        ]);
    }

    return {
        colors: colors.map((row) => row.name),
        options: [...grouped].map(([title, values]) => ({ title, values })),
    };
};

export const findProduct = async (key: string) => {
    const result = await db.query.products.findFirst({
        where: and(
            eq(products.visibility, "visible"),
            /^[a-f0-9-]{36}$/i.test(key)
                ? eq(products.id, key)
                : eq(products.slug, key),
        ),
        with: {
            image: true,
            sliderImages: { orderBy: asc(files.sortOrder) },
            productVariants: true,
            options: { with: { optionDetails: true } },
            productInfos: true,
            productSpecifications: true,
            productSpecificationGroups: { with: { specifications: true } },
            reviews: {
                where: eq(reviews.visible, true),
                with: {
                    user: {
                        columns: { id: true, username: true, avatarUrl: true },
                    },
                    files: true,
                },
            },
        },
    });

    if (!result) {
        throw new ApiError({ statusCode: 404, message: "Product not found" });
    }

    return result;
};
