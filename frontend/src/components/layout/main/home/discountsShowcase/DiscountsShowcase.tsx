import { DiscountsShowcaseProps } from "./DiscountsShowcase.interfaces";

import CardsComponent from "@/components/ui/main/card/CardsComponent";

export default function DiscountsShowcase({
    data,
}: Readonly<DiscountsShowcaseProps>) {
    const { products } = data;

    return (
        <section className="container mx-auto px-5 py-10">
            <div className="mb-8">
                <h4 className="text-2xl md:text-3xl font-medium">
                    Latest offers
                </h4>
            </div>
            {products.length === 0 && (
                <p className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
                    No offers in the latest arrivals. Check back soon.
                </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <CardsComponent productsData={products} />
            </div>
        </section>
    );
}
