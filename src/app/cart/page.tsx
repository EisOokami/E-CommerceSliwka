import OrderSummary from "@/components/layout/cart/orderSummary/OrderSummary";
import { cartItemsData } from "./page.data";

import CartList from "@/components/layout/cart/cartList/CartList";

export default function Home() {
    return (
        <main className="container mx-auto px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                Shopping Cart
            </h1>
            <div className="grid md:flex md:gap-20">
                <CartList cartItemsData={cartItemsData} />
                <OrderSummary cartItemsData={cartItemsData} />
            </div>
        </main>
    );
}
