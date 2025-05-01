"use server";

import qs from "qs";
import { mutateData } from "../services/mutateData";
import { getUserMeLoader } from "../services/getUserMeLoader";
import { getCartProductData } from "../loaders";

export async function addProductToCartAction(documentId: string) {
    const productCart = await getCartProductData(documentId);

    if (productCart.length) {
        return { ok: false, message: "Product already added to cart" };
    }

    const user = await getUserMeLoader();

    if (!user.ok) {
        console.error("User not found");
        return { ok: false, message: "User not found" };
    }

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        data: {
            quantity: 1,
            store: {
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
