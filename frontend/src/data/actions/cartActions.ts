"use server";

import qs from "qs";
import { redirect } from "next/navigation";
import { mutateData } from "../services/mutateData";
import { getUserMeLoader } from "../services/getUserMeLoader";
import { getCartProductData, getCartProductsData } from "../loaders";
import { ICart } from "@/interfaces/interfaces";

export async function addQuantityToProductAction(documentId: string) {
    const productCart = await getCartProductData(documentId);
    const user = await getUserMeLoader();

    if (!productCart) {
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
            product: {
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
    const productCart = await getCartProductData(documentId);
    const user = await getUserMeLoader();

    if (!productCart) {
        throw new Error("Product not found");
    }

    if (!user.ok) {
        throw new Error("User not found");
    }

    if (productCart.quantity <= 1) {
        throw new Error("Quantity must more than 0");
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            quantity: productCart.quantity - 1,
            product: {
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
    const productCart = await getCartProductData(documentId);
    const user = await getUserMeLoader();

    if (!productCart) {
        throw new Error("Product not found");
    }

    if (!user.ok) {
        throw new Error("User not found");
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

export async function redirectToCheckoutAction(cartItemsData: ICart[]) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            cartItems: cartItemsData,
        },
    };

    const responseData = await mutateData(
        "POST",
        `/api/orders?${query}`,
        payload,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Redirect to Checkout");
    }

    const url = responseData.stripeSession.url;

    redirect(url);
}

export async function deleteProductsFromCartAction() {
    const cartData: ICart[] = await getCartProductsData();
    const user = await getUserMeLoader();

    if (!cartData.length) {
        throw new Error("Products not found");
    }

    if (!user.ok) {
        throw new Error("User not found");
    }

    for (const productCart of cartData) {
        const responseData = await mutateData(
            "DELETE",
            `/api/carts/${productCart.documentId}`,
        );

        if (!responseData) {
            throw new Error("Ops! Something went wrong. Please try again.");
        }

        if (responseData.error) {
            console.error(responseData.error);
            throw new Error("Failed to Delete Products from Cart.");
        }
    }
}

export async function updateOrderAfterCheckoutAction(isSuccess: boolean) {
    const user = await getUserMeLoader();

    if (!user.ok) {
        throw new Error("User not found");
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            isSuccess: isSuccess,
        },
    };

    const responseData = await mutateData(
        "POST",
        `/api/orders/update-order-after-checkout?${query}`,
        payload,
    );

    if (!responseData) {
        throw new Error("Ops! Something went wrong. Please try again.");
    }

    if (responseData.error) {
        console.error(responseData.error);
        throw new Error("Failed to Redirect to Checkout");
    }
}
