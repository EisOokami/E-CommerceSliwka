"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { LuFilterX } from "react-icons/lu";

import CategoriesCarouselSkeleton from "@/components/ui/main/categoriesCarousel/CategoriesCarouselSkeleton";
import CardSkeleton from "@/components/ui/main/card/CardSkeleton";
import type { ProductsProps } from "./Products.interfaces";

const CardsComponent = dynamic(
    () => import("@/components/ui/main/card/CardsComponent"),
    {
        ssr: false,
        loading: () => (
            <>
                {[...Array(4)].map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </>
        ),
    },
);
const CategoriesCarousel = dynamic(
    () => import("@/components/ui/main/categoriesCarousel/CategoriesCarousel"),
    {
        ssr: false,
        loading: () => <CategoriesCarouselSkeleton />,
    },
);

export default function Products({ data }: Readonly<ProductsProps>) {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const { categories, tabs, newArrival, bestseller, featuredProducts } = data;
    const tabsData = useMemo(
        () => [newArrival, bestseller, featuredProducts],
        [newArrival, bestseller, featuredProducts],
    );

    const productsData = (tabsData[activeTab] ?? []).filter(
        (product) =>
            activeCategory === "all" ||
            product.category.category === activeCategory,
    );

    return (
        <section>
            <div className="px-5 py-10 bg-gray-100">
                <CategoriesCarousel
                    categoriesData={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>
            <div className="grid gap-7 container mx-auto px-5 py-10">
                <div className="flex gap-5 md:gap-10 whitespace-nowrap overflow-x-auto">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.id}
                            className={`text-lg md:text-xl font-medium cursor-pointer ${
                                activeTab === i
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab(i)}
                        >
                            {tab.item}
                        </button>
                    ))}
                </div>
                {productsData.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        <CardsComponent productsData={productsData} />
                    </div>
                ) : (
                    <div className="grid place-content-center gap-2 w-full h-96">
                        <div className="flex justify-center">
                            <LuFilterX className="text-8xl text-gray-300" />
                        </div>
                        <h1 className="text-center text-3xl text-gray-800 font-medium">
                            No products found
                        </h1>
                        <p className="text-center text-2xl text-gray-500">
                            Try adjusting your filter criteria
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
