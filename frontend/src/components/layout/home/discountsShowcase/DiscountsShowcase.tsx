import { DiscountsShowcaseProps } from "./DiscountsShowcase.interfaces";

import Card from "@/components/ui/card/Card";

export default function DiscountsShowcase({
    data,
}: Readonly<{
    data: DiscountsShowcaseProps;
}>) {
    const { stores } = data;

    return (
        <section className="container mx-auto px-3 md:px-5 py-10">
            <div className="mb-8">
                <h4 className="text-2xl md:text-3xl font-medium">
                    Discounts uр to -50%
                </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {stores.map((product) => (
                    <Card
                        key={product.documentId}
                        imageSrc={`${process.env.NEXT_PUBLIC_DB_URL}${product.image.url}`}
                        imageAlt={product.name}
                        imageWidth={250}
                        imageHeight={250}
                        title={product.name}
                        price={`$${
                            product.isDiscount
                                ? product.discountedPrice
                                : product.price
                        }`}
                        buttonHref={`/catalog/${product.documentId}`}
                        buttonTheme="dark"
                        buttonText="Buy Now"
                        buttonClassName="self-end"
                    />
                ))}
            </div>
        </section>
    );
}
