"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
    IoPhonePortraitOutline,
    IoWatchOutline,
    IoCameraOutline,
} from "react-icons/io5";
import { FiHeadphones } from "react-icons/fi";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { LuGamepad2 } from "react-icons/lu";
import Card from "@/components/ui/card/Card";

const initialCategoriesData = [
    {
        icon: IoPhonePortraitOutline,
        name: "Phones",
    },
    {
        icon: IoWatchOutline,
        name: "Smartwatches",
    },
    {
        icon: IoCameraOutline,
        name: "Cameras",
    },
    {
        icon: FiHeadphones,
        name: "Headphones",
    },
    {
        icon: HiOutlineComputerDesktop,
        name: "Computers",
    },
    {
        icon: LuGamepad2,
        name: "Gaming",
    },
];

const initialTabsData = ["New Arrival", "Bestseller", "Featured Products"];

export default function Products() {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleChangeActiveTab = (index: number) => {
        setActiveTab(index);
    };

    return (
        <section>
            <div className="px-3 md:px-5 py-20 bg-gray-100">
                <div className="grid gap-7 container mx-auto p-3 md:p-0">
                    <div className="flex justify-between items-center">
                        <h4 className="text-2xl md:text-3xl font-medium">
                            Browse By Category
                        </h4>
                        <div className="flex items-center gap-5 text-xl md:text-2xl">
                            <button>
                                <FaChevronLeft />
                            </button>
                            <button>
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                    <div className="grid lg:flex grid-cols-2 md:grid-cols-3 lg:justify-between lg:items-center gap-5">
                        {initialCategoriesData.map((category, i) => (
                            <div
                                key={i}
                                className="grid justify-items-center gap-5 w-full p-5 bg-gray-200 rounded-xl"
                            >
                                <category.icon className="text-4xl sm:text-5xl" />
                                <span className="text-base sm:text-xl font-medium">
                                    {category.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid gap-7 container mx-auto px-3 md:px-5 py-10">
                <div className="flex gap-5 md:gap-10 whitespace-nowrap overflow-y-auto">
                    {initialTabsData.map((tab, i) => (
                        <div
                            key={i}
                            className={`cursor-pointer ${
                                activeTab === i
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500"
                            }`}
                            onClick={() => handleChangeActiveTab(i)}
                        >
                            <span className="text-lg md:text-xl font-medium">
                                {tab}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {[...Array(8)].map((_, i) => (
                        <Card
                            key={i}
                            imageSrc="/product_image_thumb.png"
                            imageAlt="product"
                            imageWidth={250}
                            imageHeight={250}
                            title="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
                            price="$999"
                            buttonHref="/catalog"
                            buttonTheme="dark"
                            buttonText="Buy Now"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
