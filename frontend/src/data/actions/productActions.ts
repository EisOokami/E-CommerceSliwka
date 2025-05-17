"use server";

import qs from "qs";
import { z } from "zod";
import { mutateData } from "../services/mutateData";
import { getUserMeLoader } from "../services/getUserMeLoader";
import { getCartProductData } from "../loaders";
import { uploadImagesToStrapi } from "../services/uploadImage";
import { IImage } from "@/interfaces/interfaces";
import { redirect } from "next/navigation";

export async function addProductToCartAction(documentId: string) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        console.error("User not found");
        return { ok: false, message: "User not found" };
    }

    const productCart = await getCartProductData(documentId);

    if (productCart.length) {
        return { ok: false, message: "Product already added to cart" };
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            quantity: 1,
            product: {
                connect: [{ documentId: documentId }],
            },
            user: user.data.id,
        },
    };

    const responseData = await mutateData(
        "POST",
        `/api/carts?${query}`,
        payload,
    );

    if (!responseData) {
        console.error("Ops! Something went wrong. Please try again.");
        return {
            ok: false,
            message: "Ops! Something went wrong. Please try again",
        };
    }

    if (responseData.error) {
        console.error(responseData.error);
        console.error("Failed to Add Product to Cart.");
        return { ok: false, message: "Failed to add product to cart" };
    }

    return { ok: true, message: "Product add to cart" };
}

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const schemaAddReview = z.object({
    description: z.string().min(3).max(1500, {
        message: "Description must be between 3 and 1500 characters",
    }),
    rating: z.string().min(1, {
        message: "Please select a rating",
    }),
    documentId: z.string(),
    images: z
        .any()
        .optional()
        .refine(
            (files: File[]) =>
                !files ||
                files.length === 0 ||
                files.every(
                    (file) =>
                        file.size <= MAX_FILE_SIZE &&
                        ACCEPTED_IMAGE_TYPES.includes(file.type),
                ),
            {
                message:
                    "Only .jpeg, .jpg, .png, .webp files of 5MB or less are accepted",
            },
        ),
});

export async function addReviewToProductAction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
    images: File[] | null,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const rawImages = images || [];
    const filteredImages = rawImages.filter(
        (file) => file instanceof File && file.size > 0,
    );

    const validatedFields = schemaAddReview.safeParse({
        description: formData.get("description"),
        rating: formData.get("rating"),
        documentId: formData.get("documentId"),
        images: filteredImages,
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing Fields. Failed to Add Review.",
        };
    }

    const uploadedImages = await uploadImagesToStrapi(rawImages as File[]);

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            user: user.data.id,
            description: validatedFields.data.description,
            rating: +validatedFields.data.rating,
            publicationDate: new Date().toISOString().slice(0, 10),
            lastEdited: null,
            images: uploadedImages
                ? uploadedImages.map((img: { id: string }) => img.id)
                : null,
            product: {
                connect: [{ documentId: validatedFields.data.documentId }],
            },
        },
    };

    const responseData = await mutateData(
        "POST",
        `/api/reviews?${query}`,
        payload,
    );

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            zodErrors: null,
            message: "Failed to Add Review to Product.",
        };
    }

    redirect(`/catalog/${validatedFields.data.documentId}`);
}

const schemaEditReview = z.object({
    description: z.string().min(3).max(1500, {
        message: "Description must be between 3 and 1500 characters",
    }),
    rating: z.string().min(1, {
        message: "Please select a rating",
    }),
    documentId: z.string(),
    images: z
        .any()
        .optional()
        .refine(
            (files: File[]) =>
                !files ||
                files.length === 0 ||
                files.every(
                    (file) =>
                        file.size <= MAX_FILE_SIZE &&
                        ACCEPTED_IMAGE_TYPES.includes(file.type),
                ),
            {
                message:
                    "Only .jpeg, .jpg, .png, .webp files of 5MB or less are accepted",
            },
        ),
});

export async function editReviewAction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
    imagesFromReview: IImage[] | null,
    imagesFromUpload: File[] | null,
    documentIdReview: string,
    publicationDate: string,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const rawImages = imagesFromUpload || [];
    const filteredImages = rawImages.filter(
        (file) => file instanceof File && file.size > 0,
    );

    const validatedFields = schemaEditReview.safeParse({
        description: formData.get("description"),
        rating: formData.get("rating"),
        documentId: formData.get("documentId"),
        images: filteredImages,
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing Fields. Failed to Edit Review.",
        };
    }

    const uploadedImages = await uploadImagesToStrapi(rawImages as File[]);
    const updatedImages = [
        ...(imagesFromReview || []),
        ...(uploadedImages || []),
    ];

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            user: user.data.id,
            description: validatedFields.data.description,
            rating: +validatedFields.data.rating,
            publicationDate: publicationDate,
            lastEdited: new Date().toISOString().slice(0, 10),
            images: updatedImages.length
                ? updatedImages.map((img: { id: string }) => img.id)
                : null,
            product: {
                connect: [{ documentId: validatedFields.data.documentId }],
            },
        },
    };

    const responseData = await mutateData(
        "PUT",
        `/api/reviews/${documentIdReview}?${query}`,
        payload,
    );

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            zodErrors: null,
            message: "Failed to Edit Review.",
        };
    }

    redirect(`/catalog/${validatedFields.data.documentId}`);
}

export async function deleteReviewAction(documentIdReview: string) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const responseData = await mutateData(
        "DELETE",
        `/api/reviews/${documentIdReview}`,
    );

    if (!responseData) {
        console.error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        console.error("Failed to Delete Product.");
    }

    return { data: documentIdReview };
}

export async function addProductToWishlistAction(documentId: string) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            product: {
                connect: [{ documentId: documentId }],
            },
            user: user.data.id,
        },
    };

    const responseData = await mutateData(
        "POST",
        `/api/wishlists?${query}`,
        payload,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Add Product to Wishlist.");
    }
}

export async function deleteProductFromWishlistAction(
    documentIdWishlist: string,
) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const responseData = await mutateData(
        "DELETE",
        `/api/wishlists/${documentIdWishlist}`,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Delete Product from Wishlist.");
    }
}
