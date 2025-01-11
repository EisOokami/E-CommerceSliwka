import Button from "@/components/ui/button/Button";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa6";

export default function DiscountsShowcase() {
    return (
        <section className="container mx-auto px-3 py-10">
            <div className="mb-8">
                <h4 className="text-2xl md:text-3xl font-medium">
                    Discounts uр to -50%
                </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="grid justify-items-center gap-3 p-3 md:p-8 bg-gray-100 rounded-md cursor-pointer"
                    >
                        <FaRegHeart className="justify-self-end text-2xl md:text-3xl text-gray-500" />
                        <Image
                            src="/product_image_thumb.png"
                            alt="image"
                            width={250}
                            height={250}
                        />
                        <span className="text-center md:text-lg font-medium">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit
                        </span>
                        <span className="text-2xl md:text-3xl font-semibold">
                            $999
                        </span>
                        <Button theme="dark" text="Buy now" />
                    </div>
                ))}
            </div>
        </section>
    );
}
