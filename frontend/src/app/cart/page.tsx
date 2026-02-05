import { redirect } from "next/navigation";
import { getCartProductsData } from "@/data/loaders";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import { IoCartOutline } from "react-icons/io5";

import CartList from "@/components/layout/cart/cartList/CartList";
import OrderSummary from "@/components/layout/cart/orderSummary/OrderSummary";
import RefreshOnFocus from "@/components/layout/refreshOnFocus/RefreshOnFocus";

export default async function CartPage() {
    const user = await getUserMeLoader();
    const data = await getCartProductsData();

    if (!user.ok) {
        redirect("/singIn");
    }

    return (
        <main className="container mx-auto px-5 py-10 md:py-16">
            <RefreshOnFocus />
            <div className="flex items-center gap-1 mb-3">
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
