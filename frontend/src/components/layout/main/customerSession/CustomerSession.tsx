"use client";

import { useLayoutEffect } from "react";
import { resetCustomerState } from "@/stores/resetCustomer";
import useGlobalStore from "@/stores/global";
import { CustomerSessionProps } from "./CustomerSession.interfaces";

let currentCustomer: string | null | undefined;

export default function CustomerSession({
    id,
    cartCount,
    wishlistCount,
}: Readonly<CustomerSessionProps>) {
    useLayoutEffect(() => {
        if (currentCustomer !== id) {
            resetCustomerState();

            currentCustomer = id;
        }

        useGlobalStore.setState({
            productsInCartCount: cartCount,
            productsInWishlistCount: wishlistCount,
        });
    }, [id, cartCount, wishlistCount]);

    return null;
}
