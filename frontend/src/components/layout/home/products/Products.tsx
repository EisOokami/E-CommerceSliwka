"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
            <div className="px-3 md:px-5 py-10 bg-gray-100">
                <CategoriesCarousel
                    categoriesData={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setProductsData={setProductsData}
                    tabsData={tabsData}
                    activeTab={activeTab}
                />
            </div>
            <div className="grid gap-7 container mx-auto px-3 md:px-5 py-10">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {productsData.length ? (
                        <CardsComponent productsData={productsData} />
                    ) : (
                        <div className="grid place-items-center gap-2 w-full">
                            <Image
                                src="/no-data.svg"
                                alt="no-data"
                                width={300}
                                height={300}
                            />
                            <h1 className="text-center text-3xl text-gray-500 font-medium">
                                Sorry... <br />
                                no result found
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
