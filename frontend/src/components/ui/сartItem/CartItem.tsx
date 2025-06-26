"use client";

import { useState } from "react";
import useGlobalStore from "@/stores/global";
import useCartStore from "@/stores/cart";
import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";
import {
    addQuantityToProductAction,
    deleteProductFromCartAction,
    removeQuantityToProductAction,
} from "@/data/actions/cartActions";
import { CartItemProps } from "./CartItem.interfaces";
import { getProductsInCartCount } from "@/data/loaders";

export default function CartItem({ cartItem }: Readonly<CartItemProps>) {
    const setProductsInCartCount = useGlobalStore(
        (state) => state.setProductsInCartCount,
    );
    const deletedProducts = useCartStore((state) => state.deletedProducts);
    const setDeletedProducts = useCartStore(
        (state) => state.setDeletedProducts,
    );
    const [productQuantity, setProductQuantity] = useState<number>(
        cartItem.quantity,
    );
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const handleAddQuantityToProduct = () => {
        addQuantityToProductAction(cartItem.product.documentId);
        setProductQuantity((prevState) => prevState + 1);
    };

    const handleRemoveQuantityToProduct = () => {
        removeQuantityToProductAction(cartItem.product.documentId);
        setProductQuantity((prevState) => {
            if (prevState === 1) {
                return prevState;
            }

            return prevState - 1;
        });
    };

    const handleDeleteProductFromCart = async () => {
        setIsVisible(false);
        setTimeout(
            () => setDeletedProducts([...deletedProducts, cartItem.documentId]),
            300,
        );

        deleteProductFromCartAction(cartItem.product.documentId);

        const updatedProductsInCartCount = await getProductsInCartCount();

        setProductsInCartCount(updatedProductsInCartCount);
    };

    const optionPrice = cartItem.option ? cartItem.option.priceDifference : 0;
    const colorPrice = cartItem.color ? cartItem.color.priceDifference : 0;
    const optionValue = cartItem.option ? cartItem.option.value : "";
    const colorName = cartItem.color ? cartItem.color.colorName : "";

    return (
        <section
            className={`flex items-center gap-6 w-full min-h-48 py-8 first:border-none border-t transition-all duration-300 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
        >
            <Image
                src={`${process.env.NEXT_PUBLIC_DB_URL}${cartItem.product.image.url}`}
                alt={
                    cartItem.product.image.alternativeText ??
                    cartItem.product.name
                }
                width={100}
                height={100}
                className="w-20 lg:w-auto h-20 lg:h-auto object-contain"
            />
            <div className="grid xl:flex items-center gap-2 w-full">
                <div className="md:flex-1 grid gap-2">
                    <h6 className="text-base lg:text-xl text-pretty font-medium">
                        {cartItem.product.name}
                        {cartItem.option || cartItem.color ? " | " : " "}
                        {optionValue} {colorName}
                    </h6>
                    <span className="text-sm lg:text-base">
                        #{cartItem.product.documentId}
                    </span>
                </div>
                <div className="flex justify-start items-center gap-2 md:gap-6">
                    <div className="flex items-center gap-3">
                        <button onClick={handleRemoveQuantityToProduct}>
                            <FaMinus />
                        </button>
                        <span className="px-2 md:px-4 py-0.5 md:py-1 border rounded">
                            {productQuantity}
                        </span>
                        <button onClick={handleAddQuantityToProduct}>
                            <FaPlus />
                        </button>
                    </div>
                    <h5 className="text-xl lg:text-2xl font-medium">
                        $
                        {cartItem.product.isDiscount &&
                        cartItem.product.discountedPrice
                            ? cartItem.product.discountedPrice +
                              colorPrice +
                              optionPrice
                            : cartItem.product.price + colorPrice + optionPrice}
                    </h5>
                    <button onClick={handleDeleteProductFromCart}>
                        <IoCloseOutline className="text-3xl" />
                    </button>
                </div>
            </div>
        </section>
    );
}
