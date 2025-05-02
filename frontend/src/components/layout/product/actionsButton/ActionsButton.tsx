"use client";

import toast from "react-hot-toast";
import { addProductToCartAction } from "@/data/actions/productActions";
import { ActionsButtonProps } from "./ActionsButton.interfaces";

import Button from "@/components/ui/button/Button";

export default function ActionsButton({
    strapiData,
}: Readonly<ActionsButtonProps>) {
    const handleAddProductToCart = async () => {
        const fetchResult = await addProductToCartAction(strapiData.documentId);

        if (fetchResult.ok) {
            toast.success(fetchResult.message, {
                position: "bottom-right",
                className: "text-xl border-l-8 border-green-500",
            });
        }

        if (!fetchResult.ok) {
            toast.error(fetchResult.message, {
                position: "bottom-right",
                className: "text-xl border-l-8 border-red-500",
            });
        }
    };

    return (
        <div className="grid lg:flex items-center gap-3 md:gap-5">
            <Button
                theme="dark"
                text="Add to Wishlist"
                inline
                className="w-full text-center"
            />
            <Button
                theme="dark"
                text="Add to Cart"
                className="w-full text-center"
                onClick={handleAddProductToCart}
            />
        </div>
    );
}
