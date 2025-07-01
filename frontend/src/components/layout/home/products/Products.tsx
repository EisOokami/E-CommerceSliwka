"use client";

import { useEffect, useMemo, useState } from "react";
import { LuFilterX } from "react-icons/lu";
import { IProduct } from "@/interfaces/interfaces";
import { ProductsProps } from "./Products.interfaces";

import CardsComponent from "@/components/ui/card/CardsComponent";
import CategoriesCarousel from "@/components/ui/categoriesCarousel/CategoriesCarousel";

export default function Products({ data }: Readonly<{ data: ProductsProps }>) {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [productsData, setProductsData] = useState<IProduct[]>([]);

    const { categories, tabs, newArrival, bestseller, featuredProducts } = data;
    const tabsData = useMemo(
        () => [newArrival, bestseller, featuredProducts],
        [newArrival, bestseller, featuredProducts],
    );

    useEffect(() => {
        setProductsData(tabsData[activeTab]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeActiveTab = (index: number) => {
        const updatedProductsData = tabsData[index].filter(
            (productData) =>
                activeCategory === "all" ||
                productData.category.category === activeCategory,
        );

        setProductsData(updatedProductsData);
        setActiveTab(index);
    };

    return (
        <section>
            <div className="px-5 py-10 bg-gray-100">
                <CategoriesCarousel
                    categoriesData={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setProductsData={setProductsData}
                    tabsData={tabsData}
                    activeTab={activeTab}
                />
            </div>
            <div className="grid gap-7 container mx-auto px-5 py-10">
                <div className="flex gap-5 md:gap-10 whitespace-nowrap overflow-y-auto">
                    {tabs.map((tab, i) => (
                        <div
                            key={tab.id}
                            className={`cursor-pointer ${
                                activeTab === i
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500"
                            }`}
                            onClick={() => handleChangeActiveTab(i)}
                        >
                            <span className="text-lg md:text-xl font-medium">
                                {tab.item}
                            </span>
                        </div>
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
