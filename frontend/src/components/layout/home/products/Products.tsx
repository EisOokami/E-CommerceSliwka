"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IconType } from "react-icons";
import { FaGamepad } from "react-icons/fa";
import {
    // FaChevronLeft, FaChevronRight,
    FaHeadphones,
} from "react-icons/fa6";
import { IoPhonePortraitOutline, IoWatch } from "react-icons/io5";
import { BsCamera2 } from "react-icons/bs";
import { HiComputerDesktop } from "react-icons/hi2";
import { IoIosLaptop } from "react-icons/io";
import { TbDotsCircleHorizontal } from "react-icons/tb";
import { ProductsProps } from "./Products.interfaces";

import Card from "@/components/ui/card/Card";
import { IProduct } from "@/interfaces/interfaces";

const initialCategoriesData: { [key: string]: IconType } = {
    smartphones: IoPhonePortraitOutline,
    smartwatches: IoWatch,
    cameras: BsCamera2,
    headphones: FaHeadphones,
    computers: HiComputerDesktop,
    laptops: IoIosLaptop,
    gaming: FaGamepad,
    other: TbDotsCircleHorizontal,
};

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

    const handleChangeActiveCategory = (category: string) => {
        if (activeCategory === category) {
            setActiveCategory("all");
            setProductsData(tabsData[activeTab]);
            return;
        }

        const updatedProductsData = tabsData[activeTab].filter(
            (productData) => productData.category.category === category,
        );

        setActiveCategory(category);
        setProductsData(updatedProductsData);
    };

    return (
        <section>
            <div className="px-3 md:px-5 py-20 bg-gray-100">
                <div className="grid gap-7 container mx-auto p-3 md:p-0">
                    <div className="flex justify-between items-center">
                        <h4 className="text-2xl md:text-3xl font-medium">
                            Browse By Category
                        </h4>
                        {/* <div className="flex items-center gap-5 text-xl md:text-2xl">
                            <button>
                                <FaChevronLeft />
                            </button>
                            <button>
                                <FaChevronRight />
                            </button>
                        </div> */}
                    </div>
                    <div className="grid xl:flex grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:justify-between xl:items-center gap-5">
                        {categories.map((category) => {
                            const Icon =
                                initialCategoriesData[
                                    category.category.toLowerCase()
                                ];

                            return (
                                <div
                                    key={category.id}
                                    className={`grid justify-items-center gap-5 w-full p-5 hover:bg-gray-300 rounded-xl cursor-pointer transition ${
                                        activeCategory === category.category
                                            ? "bg-gray-300"
                                            : "bg-gray-200"
                                    }`}
                                    onClick={() =>
                                        handleChangeActiveCategory(
                                            category.category,
                                        )
                                    }
                                >
                                    <Icon className="text-4xl sm:text-5xl" />
                                    <span className="text-base sm:text-xl font-medium">
                                        {category.category}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
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
                        productsData.map((product) => (
                            <Card
                                key={product.documentId}
                                imageSrc={`${process.env.NEXT_PUBLIC_DB_URL}${product.image.url}`}
                                imageAlt={
                                    product.image.alternativeText ??
                                    product.name
                                }
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
                            />
                        ))
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
