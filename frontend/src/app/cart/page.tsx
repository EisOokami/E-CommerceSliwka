import { getCartProductsData } from "@/data/loaders";
import { IoCartOutline } from "react-icons/io5";
import { ICart } from "@/interfaces/interfaces";

import CartList from "@/components/layout/cart/cartList/CartList";
import OrderSummary from "@/components/layout/cart/orderSummary/OrderSummary";

export default async function CartPage() {
    const data: ICart[] = await getCartProductsData();

    return (
        <main className="container mx-auto px-5 py-10 md:py-20">
            <div className="flex items-center gap-1">
                <IoCartOutline className="md:mt-1 text-3xl" />
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Shopping Cart
                </h1>
            </div>
            <div className="grid md:flex md:gap-20">
                <CartList cartItemsData={data} />
                <OrderSummary cartItemsData={data} />
            </div>
        </main>
    );
}
