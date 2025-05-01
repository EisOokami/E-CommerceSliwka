"use server";

import qs from "qs";
import { mutateData } from "../services/mutateData";
import { getUserMeLoader } from "../services/getUserMeLoader";
import { getCartProductData } from "../loaders";

export async function addQuantityToProductAction(documentId: string) {
    const cartData = await getCartProductData(documentId);
    const productCart = cartData[0];
    const user = await getUserMeLoader();

    if (!cartData.length) {
        throw new Error("Product not found");
    }

    if (!user.ok) {
        throw new Error("User not found");
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            quantity: productCart.quantity + 1,
            store: {
                connect: [{ documentId: documentId }],
            },
            user: user.data.id,
        },
    };

    const responseData = await mutateData(
        "PUT",
        `/api/carts/${productCart.documentId}?${query}`,
        payload,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Add Quantity to Product.");
    }
}

export async function removeQuantityToProductAction(documentId: string) {
    const cartData = await getCartProductData(documentId);
    const productCart = cartData[0];
    const user = await getUserMeLoader();

    if (!cartData.length) {
        throw new Error("Product not found");
    }

    if (!user.ok) {
        throw new Error("User not found");
    }

    if (productCart.quantity <= 0) {
        throw new Error("Quantity must more than 0");
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            quantity: productCart.quantity - 1,
            store: {
                connect: [{ documentId: documentId }],
            },
            user: user.data.id,
        },
    };

    const responseData = await mutateData(
        "PUT",
        `/api/carts/${productCart.documentId}?${query}`,
        payload,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Remove Quantity to Product.");
    }
}

export async function deleteProductFromCartAction(documentId: string) {
    const cartData = await getCartProductData(documentId);
    const productCart = cartData[0];
    const user = await getUserMeLoader();

    if (!cartData.length) {
        throw new Error("Product not found");
    }

    if (!user.ok) {
        throw new Error("User not found");
    }

    if (productCart.quantity <= 0) {
        throw new Error("Quantity must more than 0");
    }

    const responseData = await mutateData(
        "DELETE",
        `/api/carts/${productCart.documentId}`,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Delete Product from Cart.");
    }
}
