import styles from "./OrderSummary.module.scss";
import { OrderSummaryProps } from "./OrderSummary.interfaces";

import Button from "@/components/ui/button/Button";

export default function OrderSummary({
    cartItemsData,
}: Readonly<OrderSummaryProps>) {
    const subtotal = cartItemsData.reduce((accumulator, currentValue) => {
        const price = currentValue.store.isDiscount
            ? (currentValue.store.discountedPrice as number)
            : currentValue.store.price;

        return accumulator + price * currentValue.quantity;
    }, 0);
    const tax = +(subtotal * 0.23).toFixed(2);
    const shippingAndHandling = 50;
    const total = (subtotal + tax + shippingAndHandling).toFixed(2);

    return (
        <div className="grid content-start gap-5 w-full h-min md:w-1/2 p-5 md:p-8 xl:p-14 border rounded-xl">
            <h3 className="mb-2 text-xl md:text-2xl xl:text-3xl font-medium">
                Order Summary
            </h3>
            <div className={styles["order-summary__input-group"]}>
                <label
                    htmlFor="code"
                    className={styles["order-summary__label"]}
                >
                    Discount code / Promo code
                </label>
                <input
                    type="text"
                    id="code"
                    className={styles["order-summary__input"]}
                    placeholder="Code"
                />
            </div>
            <div className={styles["order-summary__input-group"]}>
                <label
                    htmlFor="card"
                    className={styles["order-summary__label"]}
                >
                    Your bonus card number
                </label>
                <div className="relative w-full">
                    <input
                        type="text"
                        id="card"
                        className={`${styles["order-summary__input"]} !pr-28`}
                        placeholder="Enter Card Number"
                    />
                    <Button
                        text="Apply"
                        theme="dark"
                        inline
                        className="absolute right-4 top-4 px-4 md:px-5 py-1 text-sm md:text-base font-medium"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">{subtotal}$</span>
            </div>
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <span>Estimated Tax</span>
                    <span className="font-medium">${tax}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="w-3/4 text-pretty">
                        Estimated Shipping & Handling
                    </span>
                    <span className="font-medium">${shippingAndHandling}</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-medium">${total}</span>
            </div>
            <Button
                // href="/cart/address"
                // isLink
                href=""
                text="Checkout"
                theme="dark"
                className="w-full"
            />
        </div>
    );
}
