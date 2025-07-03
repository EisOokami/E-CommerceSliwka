import useCatalogStore from "@/stores/catalog";
import { LuSearchX } from "react-icons/lu";
import { ProductsProps } from "./Products.interfaces";

import RatingSelect from "@/components/ui/ratingSelect/RatingSelect";
import CardsComponent from "@/components/ui/card/CardsComponent";
import CardSkeleton from "@/components/ui/card/CardSkeleton";

export default function Products({ productsData }: Readonly<ProductsProps>) {
    const productsCount = useCatalogStore((state) => state.productsCount);
    const isProductLoading = useCatalogStore((state) => state.isProductLoading);

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
                    <RatingSelect />
                </div>
            </div>
            {!productsData.length && !isProductLoading ? (
                <div className="grid place-items-center gap-2 w-full">
                    <LuSearchX className="text-8xl text-gray-300" />
                    <h1 className="text-center text-3xl text-gray-800 font-medium">
                        No products found
                    </h1>
                    <p className="text-center text-2xl text-gray-500">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            ) : isProductLoading ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-3 md:gap-5">
                    {[...Array(9)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-3 md:gap-5">
                    <CardsComponent productsData={productsData} />
                </div>
            )}
        </section>
    );
}
