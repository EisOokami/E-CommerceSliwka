import { DiscountsShowcaseProps } from "./DiscountsShowcase.interfaces";

import CardsComponent from "@/components/ui/card/CardsComponent";

export default function DiscountsShowcase({
    data,
}: Readonly<{
    data: DiscountsShowcaseProps;
}>) {
    const { products } = data;

    return (
        <section className="container mx-auto px-5 py-10">
            <div className="mb-8">
                <h4 className="text-2xl md:text-3xl font-medium">
                    Discounts uр to -50%
                </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <CardsComponent productsData={products} />
            </div>
        </section>
    );
}
