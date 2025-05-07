import OrderSummary from "@/components/layout/cart/orderSummary/OrderSummary";

import CartList from "@/components/layout/cart/cartList/CartList";
import { getCartProductsData } from "@/data/loaders";

export default async function CartPage() {
    const data = await getCartProductsData();

    return (
        <main className="container mx-auto px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                Shopping Cart
            </h1>
            <div className="grid md:flex md:gap-20">
                <CartList cartItemsData={data} />
                <OrderSummary cartItemsData={data} />
            </div>
        </main>
    );
}
