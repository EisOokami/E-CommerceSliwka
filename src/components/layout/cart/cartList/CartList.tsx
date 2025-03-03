import CartItem from "@/components/ui/сartItem/CartItem";
import { CartListProps } from "./CartList.interfaces";

export default function CartList({ cartItemsData }: Readonly<CartListProps>) {
    return (
        <div className="grid w-full md:w-1/2">
            {cartItemsData.map((cartItem, i) => (
                <CartItem key={i} cartItem={cartItem} />
            ))}
        </div>
    );
}
