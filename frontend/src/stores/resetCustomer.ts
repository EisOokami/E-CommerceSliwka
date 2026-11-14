"use client";

import useCartStore from "./cart";
import useWishlistStore from "./wishlist";
import useGlobalStore from "./global";
import useProductStore from "./product";
import useOrderStore from "./order";

export function resetCustomerState() {
    useCartStore.setState(useCartStore.getInitialState(), true);
    useWishlistStore.setState(useWishlistStore.getInitialState(), true);
    useGlobalStore.setState(useGlobalStore.getInitialState(), true);
    useProductStore.setState(useProductStore.getInitialState(), true);
    useOrderStore.setState(useOrderStore.getInitialState(), true);
}
