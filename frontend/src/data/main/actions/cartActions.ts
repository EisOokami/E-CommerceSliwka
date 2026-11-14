"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mutateData } from "../services/mutateData";
import { getCartProductData, getCartProductsData } from "../loaders";
import type { ICart } from "@/interfaces/interfaces";
import {
    quantitySchema,
    redirectToCheckoutSchema,
    sessionSchema,
} from "@/lib/schemas/main/cart";
import { uuidSchema } from "@/lib/schemas/schemas";

export async function changeQuantityToProductAction(id: string, value: number) {
    const quantity = quantitySchema.parse(Number(value));
    const validatedId = uuidSchema.parse(id);

    await mutateData("PUT", `/api/carts/${validatedId}`, {
        quantity,
    });

    revalidatePath("/cart");
}

export async function addQuantityToProductAction(id: string) {
    const item = await getCartProductData(id);

    if (!item) {
        throw new Error("Cart item not found.");
    }

    await changeQuantityToProductAction(id, item.quantity + 1);
}

export async function removeQuantityToProductAction(id: string) {
    const item = await getCartProductData(id);

    if (!item) {
        throw new Error("Cart item not found.");
    }

    await changeQuantityToProductAction(id, item.quantity - 1);
}

export async function deleteProductFromCartAction(id: string) {
    const validatedId = uuidSchema.parse(id);

    await mutateData("DELETE", `/api/carts/${validatedId}`);

    revalidatePath("/cart");
}

export async function deleteProductsFromCartAction(): Promise<boolean> {
    for (const item of await getCartProductsData()) {
        await deleteProductFromCartAction(item.id);
    }

    return true;
}

export async function redirectToCheckoutAction(
    items: ICart[],
    couponCode?: string,
) {
    const payload = redirectToCheckoutSchema.parse({
        cartItems: items,
        ...(couponCode && couponCode.trim()
            ? {
                  couponCode: couponCode.trim().toUpperCase(),
              }
            : {}),
    });

    const response = await mutateData<{
        stripeSession: {
            url: string | null;
        };
    }>("POST", "/api/orders", payload);

    if (!response.stripeSession.url) {
        throw new Error("Checkout is unavailable. Please try again.");
    }

    const url = new URL(response.stripeSession.url);

    if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") {
        throw new Error("Invalid checkout destination.");
    }

    redirect(url.href);
}

export async function confirmAction(checkoutSession: string): Promise<{
    isSuccess: boolean;
}> {
    const session = sessionSchema.parse(checkoutSession);

    const result = await mutateData<{
        isSuccess: boolean;
    }>("POST", "/api/orders/confirm", {
        checkoutSession: session,
    });

    if (result.isSuccess) {
        revalidatePath("/cart");
        revalidatePath("/account/order-history");
    }

    return result;
}
