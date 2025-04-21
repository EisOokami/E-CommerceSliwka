import Image from "next/image";
import { ProductsProps } from "./Products.interfaces";

import Card from "@/components/ui/card/Card";
import RatingSelect from "@/components/ui/ratingSelect/RatingSelect";

export default function Products({
    productsData,
    setProductRating,
    productsCount,
}: ProductsProps) {
    return (
        <section className="grid gap-5 w-full">
            <div className="flex justify-between items-center">
                <h4 className="text-lg md:text-xl text-gray-600 font-medium">
                    Selected Products:{" "}
                    <span className="text-xl md:text-2xl text-black font-medium">
                        {productsCount}
                    </span>
                </h4>
                <div className="hidden md:block">
                    <RatingSelect setProductRating={setProductRating} />
                </div>
            </div>
            {!productsData.length ? (
                <div className="grid place-items-center gap-2 w-full">
                    <Image
                        src="/no-data.svg"
                        alt="no-data"
                        width={300}
                        height={300}
                    />
                    <h1 className="text-center text-5xl text-gray-500 font-medium">
                        Sorry... <br />
                        no result found
                    </h1>
                </div>
            ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-3">
                    {productsData.map((productData) => (
                        <Card
                            key={productData.documentId}
                            imageSrc={`${process.env.NEXT_PUBLIC_DB_URL}${productData.image.url}`}
                            imageAlt={
                                productData.image.alternativeText ??
                                productData.name
                            }
                            imageWidth={250}
                            imageHeight={250}
                            title={productData.name}
                            price={`$${
                                productData.isDiscount
                                    ? productData.discountedPrice
                                    : productData.price
                            }`}
                            buttonHref={`/catalog/${productData.documentId}`}
                            buttonTheme="dark"
                            buttonText="Buy Now"
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
