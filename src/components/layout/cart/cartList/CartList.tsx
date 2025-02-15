import CartItem from "@/components/ui/сartItem/CartItem";
import { CartListProps } from "./CartList.interfaces";

export default function CartList({ cartItemsData }: CartListProps) {
    return (
        <div className="grid">
            {cartItemsData.map((cartItem, i) => (
                <CartItem key={i} cartItem={cartItem} />
            ))}
        </div>
    );
}
