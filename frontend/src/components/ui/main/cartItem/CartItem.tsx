"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import useGlobalStore from "@/stores/global";
import useCartStore from "@/stores/cart";
import { getProductsInCartCount } from "@/data/main/loaders";
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";
import {
    changeQuantityToProductAction,
    deleteProductFromCartAction,
} from "@/data/main/actions/cartActions";
import { CartItemProps } from "./CartItem.interfaces";

import AppImage from "../appImage/AppImage";

export default function CartItem({ cartItem }: Readonly<CartItemProps>) {
    const setProductsInCartCount = useGlobalStore(
        (state) => state.setProductsInCartCount,
    );
    const productsQuantity = useCartStore((state) => state.productsQuantity);
    const setProductsQuantity = useCartStore(
        (state) => state.setProductsQuantity,
    );
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [quantityValue, setQuantityValue] = useState<number>(1);
    const busy = useRef(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setQuantityValue(cartItem.quantity);
        setProductsQuantity({
            [cartItem.id]: cartItem.quantity,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const maximum = Math.min(999, cartItem.product.quantity);

    const changeQuantity = async (value: number) => {
        if (busy.current) {
            return;
        }

        if (!Number.isInteger(value) || value < 1 || value > maximum) {
            toast.error("Enter a quantity between 1 and " + maximum);

            return;
        }

        busy.current = true;

        setIsPending(true);

        useCartStore.setState((state) => ({
            pendingMutations: state.pendingMutations + 1,
        }));

        try {
            await changeQuantityToProductAction(cartItem.id, value);

            setQuantityValue(value);
            setProductsQuantity({ [cartItem.id]: value });
        } catch {
            setQuantityValue(
                productsQuantity[cartItem.id] ?? cartItem.quantity,
            );

            toast.error("Quantity could not be updated. Please retry.");
        } finally {
            busy.current = false;

            setIsPending(false);

            useCartStore.setState((state) => ({
                pendingMutations: Math.max(0, state.pendingMutations - 1),
            }));
        }
    };

    const handleAddQuantityToProduct = () => {
        changeQuantity(quantityValue + 1);
    };

    const handleRemoveQuantityToProduct = () => {
        changeQuantity(quantityValue - 1);
    };

    const handleChangeQuantityToProduct = (value: string) => {
        changeQuantity(Number(value));
    };

    const handleDeleteProductFromCart = async () => {
        if (busy.current) {
            return;
        }

        busy.current = true;

        setIsPending(true);

        useCartStore.setState((state) => ({
            pendingMutations: state.pendingMutations + 1,
        }));

        try {
            await deleteProductFromCartAction(cartItem.id);

            useCartStore.setState((state) => ({
                deletedProducts: [...state.deletedProducts, cartItem.id],
            }));

            setIsVisible(false);
            setProductsInCartCount(await getProductsInCartCount());
        } catch {
            toast.error("The cart could not be updated. Please reload.");
        } finally {
            busy.current = false;

            setIsPending(false);

            useCartStore.setState((state) => ({
                pendingMutations: Math.max(0, state.pendingMutations - 1),
            }));
        }
    };

    const handleDisableRedirect = (
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Link
            href={`catalog/${cartItem.product.slug}`}
            className={`flex items-center gap-6 w-full min-h-48 px-3 py-8 hover:bg-gray-50 first:border-none border-t transition-all duration-300 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            } ${
                !cartItem.product.quantity || !cartItem.product.inStock
                    ? "bg-red-500/20"
                    : ""
            }`}
            target="_blank"
        >
            <AppImage
                src={cartItem.product.image.url}
                alt={
                    cartItem.product.image.alternativeText ??
                    cartItem.product.name
                }
                width={100}
                height={100}
                className="w-20 lg:w-auto h-20 lg:h-auto object-contain"
            />
            <div className="grid xl:flex justify-between items-center gap-2 w-full">
                <div className="md:flex-1 grid gap-2">
                    <h3 className="lg:text-xl text-pretty font-medium">
                        {cartItem.product.name}
                    </h3>
                    <span className="text-sm lg:text-base">
                        Max quantity: {cartItem.product.quantity}
                    </span>
                </div>
                <div className="grid sm:flex justify-start items-center gap-2 md:gap-6">
                    <div
                        className="flex items-center gap-1"
                        onClick={(e) => handleDisableRedirect(e)}
                    >
                        <button
                            className={`p-2 hover:bg-white rounded-lg transition ${
                                quantityValue <= 1 ||
                                quantityValue > cartItem.product.quantity
                                    ? "text-gray-400 cursor-not-allowed"
                                    : ""
                            }`}
                            disabled={
                                isPending ||
                                quantityValue <= 1 ||
                                quantityValue > cartItem.product.quantity
                            }
                            onClick={handleRemoveQuantityToProduct}
                        >
                            <FaMinus />
                        </button>
                        <input
                            type="number"
                            disabled={isPending}
                            className={`text-center w-10 py-0.5 md:py-1 bg-white border rounded-lg ${
                                quantityValue > cartItem.product.quantity ||
                                quantityValue < 1
                                    ? "outline outline-4 outline-red-500"
                                    : ""
                            }`}
                            onChange={(e) => {
                                handleChangeQuantityToProduct(e.target.value);
                            }}
                            minLength={1}
                            min={1}
                            max={cartItem.product.quantity}
                            value={quantityValue.toString()}
                        />
                        <button
                            className={`p-2 hover:bg-white rounded-lg transition ${
                                quantityValue < 1 ||
                                quantityValue >= cartItem.product.quantity
                                    ? "text-gray-400 cursor-not-allowed"
                                    : ""
                            }`}
                            disabled={
                                isPending ||
                                quantityValue < 1 ||
                                quantityValue >= cartItem.product.quantity
                            }
                            onClick={handleAddQuantityToProduct}
                        >
                            <FaPlus />
                        </button>
                    </div>
                    <div className="flex justify-start items-center gap-2 md:gap-6">
                        <h1 className="text-xl lg:text-2xl font-medium">
                            $
                            {cartItem.product.isDiscount &&
                            cartItem.product.discountedPrice
                                ? cartItem.product.discountedPrice *
                                  quantityValue
                                : cartItem.product.price * quantityValue}
                        </h1>
                        <button
                            disabled={isPending}
                            onClick={(e) => {
                                handleDisableRedirect(e);
                                handleDeleteProductFromCart();
                            }}
                            className="p-1 hover:bg-white rounded-lg transition"
                        >
                            <IoCloseOutline className="text-3xl" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
