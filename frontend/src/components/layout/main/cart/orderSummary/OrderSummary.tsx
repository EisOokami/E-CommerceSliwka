"use client";

import { useState, useTransition } from "react";
import useCartStore from "@/stores/cart";
import { redirectToCheckoutAction } from "@/data/main/actions/cartActions";
import { OrderSummaryProps } from "./OrderSummary.interfaces";

import { fieldClass } from "@/constants/styles";
import Button from "@/components/ui/main/button/Button";
import { ZodErrors } from "@/components/ui/main/zodErrors/ZodErrors";

export default function OrderSummary({
    cartItemsData,
}: Readonly<OrderSummaryProps>) {
    const deletedProducts = useCartStore((state) => state.deletedProducts);
    const productsQuantity = useCartStore((state) => state.productsQuantity);
    const isCheckoutBlocked = useCartStore(
        (state) => state.isCheckoutBlocked || state.pendingMutations > 0,
    );
    const [isPending, startTransition] = useTransition();
    const [couponCode, setCouponCode] = useState("");
    const [checkoutError, setCheckoutError] = useState("");

    const subtotal = cartItemsData.reduce((accumulator, currentValue) => {
        if (
            deletedProducts.includes(currentValue.id) ||
            !currentValue.product.quantity
        ) {
            return accumulator;
        }

        const price =
            currentValue.product.isDiscount &&
            currentValue.product.discountedPrice
                ? currentValue.product.discountedPrice
                : currentValue.product.price;

        return (
            accumulator +
            price *
                (productsQuantity[currentValue.id]
                    ? productsQuantity[currentValue.id]
                    : currentValue.quantity)
        );
    }, 0);
    const tax = +(subtotal * 0).toFixed(2);
    const shippingAndHandling = subtotal ? 15 : 0;
    const total = (subtotal + tax + shippingAndHandling).toFixed(2);

    const handlePayment = () => {
        if (subtotal && !isCheckoutBlocked && !isPending) {
            startTransition(async () => {
                setCheckoutError("");

                try {
                    await redirectToCheckoutAction(
                        cartItemsData
                            .filter(
                                (item) => !deletedProducts.includes(item.id),
                            )
                            .map((item) => ({
                                ...item,
                                quantity:
                                    productsQuantity[item.id] ?? item.quantity,
                            })),
                        couponCode,
                    );
                } catch (error) {
                    if (
                        error instanceof Error &&
                        error.message === "NEXT_REDIRECT"
                    ) {
                        throw error;
                    }

                    setCheckoutError(
                        "Checkout could not be started. Check your cart and coupon, then try again.",
                    );
                }
            });
        }
    };

    return (
        <div className="grid content-start gap-5 w-full h-min md:w-1/2 p-5 md:p-8 xl:p-14 border rounded-xl">
            <h3 className="mb-2 text-xl md:text-2xl xl:text-3xl font-medium">
                Order Summary
            </h3>
            <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">${subtotal}</span>
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
                    <span className="font-medium">$0/$5/$15</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-medium">≈${total}</span>
            </div>
            <label className="grid gap-2">
                Coupon code
                <input
                    name="couponCode"
                    autoComplete="off"
                    disabled={isPending}
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    maxLength={50}
                    className={fieldClass}
                />
            </label>
            <p className="text-sm text-gray-500">
                Discounts and final shipping charges are confirmed at checkout.
            </p>
            {checkoutError && (
                <p role="alert" className="text-red-600">
                    {checkoutError}
                </p>
            )}
            {isPending ? (
                <Button
                    text="Loading"
                    theme="dark"
                    className="w-full"
                    isLoading
                />
            ) : isCheckoutBlocked ? (
                <Button
                    text="Checkout"
                    theme="dark"
                    className="w-full ring-4 ring-red-500 cursor-not-allowed"
                />
            ) : (
                <Button
                    text="Checkout"
                    theme="dark"
                    className="w-full"
                    onClick={handlePayment}
                />
            )}
            {isCheckoutBlocked && (
                <ZodErrors
                    error={[
                        "Please check if the product is in stock or specify the correct quantity",
                    ]}
                />
            )}
        </div>
    );
}
