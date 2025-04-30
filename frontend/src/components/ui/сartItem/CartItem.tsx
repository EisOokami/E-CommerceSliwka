import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { CartItemProps } from "./CartItem.interfaces";

export default function CartItem({ cartItem }: Readonly<CartItemProps>) {
    return (
        <div className="flex items-center gap-6 w-full py-8 first:border-none border-t">
            <Image
                src={`${process.env.NEXT_PUBLIC_DB_URL}${cartItem.store.image.url}`}
                alt={
                    cartItem.store.image.alternativeText ?? cartItem.store.name
                }
                width={100}
                height={100}
                className="w-20 lg:w-auto h-20 lg:h-auto"
            />
            <div className="grid xl:flex items-center gap-2 w-full">
                <div className="md:flex-1 grid gap-2">
                    <h6 className="text-base lg:text-xl text-pretty font-medium">
                        {cartItem.store.name}
                    </h6>
                    <span className="text-sm lg:text-base">
                        #{cartItem.store.documentId}
                    </span>
                </div>
                <div className="flex justify-start items-center gap-2 md:gap-6">
                    <div className="flex items-center gap-3">
                        <button>
                            <FaMinus />
                        </button>
                        <span className="px-2 md:px-4 py-0.5 md:py-1 border rounded">
                            {cartItem.quantity}
                        </span>
                        <button>
                            <FaPlus />
                        </button>
                    </div>
                    <h5 className="text-xl lg:text-2xl font-medium">
                        $
                        {cartItem.store.isDiscount
                            ? cartItem.store.discountedPrice
                            : cartItem.store.price}
                    </h5>
                    <button>
                        <IoCloseOutline className="text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}
