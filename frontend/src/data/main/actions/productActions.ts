"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { StoreApiError } from "../services/http";
import { mutateData } from "../services/mutateData";
import { emptyAction, actionFailure } from "../services/actionState";
import { uploadImagesToStrapi } from "../services/uploadImage";
import {
    getCartProductDataByProductDocumentId,
    getProductData,
    getReviewsData,
} from "../loaders";
import type { IImage } from "@/interfaces/interfaces";
import type { IAddReviewAction, IEditReviewAction } from "@/interfaces/data";
import { uuidSchema } from "@/lib/schemas/schemas";
import {
    addReviewToProductSchema,
    editReviewSchema,
    retainedItemsSchema,
} from "@/lib/schemas/main/product";

export async function addProductToCartAction(productId: string) {
    try {
        const validatedId = uuidSchema.parse(productId);

        const result = await mutateData<
            {
                id: string;
            }[]
        >("POST", "/api/carts", {
            productId: validatedId,
            quantity: 1,
        });

        if (!result[0]) {
            throw new Error("Invalid cart response");
        }

        revalidatePath("/cart");

        return {
            ok: true as const,
            message: "Product added to cart",
            data: {
                id: result[0].id,
            },
        };
    } catch (error) {
        return {
            ok: false as const,
            message:
                error instanceof z.ZodError
                    ? (error.issues[0].message ?? "Invalid input.")
                    : error instanceof StoreApiError
                      ? error.message
                      : "The store service is unavailable. Please try again.",
        };
    }
}

export async function deleteProductFromCartAction(productId: string) {
    try {
        const validatedProductId = uuidSchema.parse(productId);

        const item =
            await getCartProductDataByProductDocumentId(validatedProductId);

        if (!item) {
            return {
                ok: false,
                message: "Cart item not found",
            };
        }

        await mutateData("DELETE", `/api/carts/${item.id}`);

        revalidatePath("/cart");

        return {
            ok: true,
            message: "Product removed from cart",
            data: {
                id: item.id,
            },
        };
    } catch (error) {
        return {
            ok: false as const,
            message:
                error instanceof z.ZodError
                    ? (error.issues[0].message ?? "Invalid input.")
                    : error instanceof StoreApiError
                      ? error.message
                      : "The store service is unavailable. Please try again.",
        };
    }
}

export async function addReviewToProductAction(
    _previous: IAddReviewAction | undefined,
    form: FormData,
    images: File[] | null,
    rating: number,
    productId: string,
): Promise<IAddReviewAction> {
    const validateData = addReviewToProductSchema.safeParse({
        productId,
        description: form.get("description"),
        rating,
        images: images ?? [],
    });
    const validatedProductId = uuidSchema.parse(productId);

    if (!validateData.success) {
        return {
            ...emptyAction,
            zodErrors: z.flattenError(validateData.error).fieldErrors,
        };
    }

    try {
        const result = await mutateData<
            {
                id: string;
            }[]
        >("POST", "/api/reviews", {
            productId: validatedProductId,
            description: validateData.data.description,
            rating,
        });

        const id = result[0].id;

        if (!id) {
            throw new Error("Invalid review response");
        }

        try {
            await uploadImagesToStrapi(validateData.data.images, {
                field: "review",
                reviewId: id,
            });
        } catch {
            revalidatePath("/catalog");

            return {
                ...emptyAction,
                message:
                    "Review saved, but images could not be uploaded. Edit the review to retry.",
            };
        }

        revalidatePath("/catalog");

        return {
            ...emptyAction,
            message: "Your review added",
        };
    } catch (error) {
        return actionFailure(error);
    }
}

export async function editReviewAction(
    _previous: IEditReviewAction | undefined,
    form: FormData,
    retained: IImage[] | null,
    uploaded: File[] | null,
    id: string,
    _publicationDate: string,
    productId: string,
    rating: number,
): Promise<IEditReviewAction> {
    const validateData = editReviewSchema.safeParse({
        productId,
        description: form.get("description"),
        rating,
        images: uploaded ?? [],
    });

    if (!validateData.success) {
        return {
            ...emptyAction,
            zodErrors: z.flattenError(validateData.error).fieldErrors,
        };
    }

    let reviewSaved = false;

    try {
        const validatedId = uuidSchema.parse(id);
        const validatedRetainedItems = retainedItemsSchema.parse(
            retained ?? [],
        );

        const existing = (await getReviewsData(productId)).find((review) => {
            return review.id === id;
        });

        await mutateData("PUT", `/api/reviews/${validatedId}`, {
            description: validateData.data.description,
            rating,
        });

        reviewSaved = true;

        for (const image of existing?.images ?? []) {
            if (
                !validatedRetainedItems.some((item) => {
                    return item.id === image.id;
                })
            ) {
                await mutateData("DELETE", `/api/uploads/${image.id}`, {
                    field: "review",
                });
            }
        }

        await uploadImagesToStrapi(validateData.data.images, {
            field: "review",
            reviewId: id,
        });

        revalidatePath("/catalog");

        return {
            ...emptyAction,
            message: "Your review edited",
        };
    } catch (error) {
        revalidatePath("/catalog");

        if (reviewSaved) {
            return {
                ...emptyAction,
                message:
                    "Review saved, but some image changes failed. Reload and edit it to retry.",
            };
        }

        return actionFailure(error);
    }
}

export async function deleteReviewAction(id: string): Promise<{
    data: string;
}> {
    const validatedId = uuidSchema.parse(id);

    await mutateData("DELETE", `/api/reviews/${validatedId}`);

    revalidatePath("/catalog");

    return {
        data: id,
    };
}

export async function addProductToWishlistAction(productId: string) {
    try {
        const validatedProductId = uuidSchema.parse(productId);

        const result = await mutateData<
            {
                id: string;
            }[]
        >("POST", "/api/wishlists", {
            productId: validatedProductId,
        });

        if (!result[0].id) {
            throw new StoreApiError(502, "Invalid wishlist response.");
        }

        revalidatePath("/wishlist");

        return {
            ok: true,
            message: "Product added to wishlist",
            wishlistDocumentId: result[0].id,
        };
    } catch (error) {
        return {
            ok: false as const,
            message:
                error instanceof z.ZodError
                    ? (error.issues[0].message ?? "Invalid input.")
                    : error instanceof StoreApiError
                      ? error.message
                      : "The store service is unavailable. Please try again.",
        };
    }
}

export async function deleteProductFromWishlistAction(id: string) {
    try {
        const validatedId = uuidSchema.parse(id);

        await mutateData("DELETE", `/api/wishlists/${validatedId}`);

        revalidatePath("/wishlist");

        return {
            ok: true,
            message: "Product removed from wishlist",
        };
    } catch (error) {
        return {
            ok: false as const,
            message:
                error instanceof z.ZodError
                    ? (error.issues[0].message ?? "Invalid input.")
                    : error instanceof StoreApiError
                      ? error.message
                      : "The store service is unavailable. Please try again.",
        };
    }
}

export async function updateProductAverageRatingAction(
    id: string,
): Promise<number> {
    return (await getProductData(id)).averageRating;
}
