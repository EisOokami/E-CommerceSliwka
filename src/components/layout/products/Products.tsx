"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaRegHeart } from "react-icons/fa6";
import {
    IoPhonePortraitOutline,
    IoWatchOutline,
    IoCameraOutline,
} from "react-icons/io5";
import { FiHeadphones } from "react-icons/fi";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { LuGamepad2 } from "react-icons/lu";
import Button from "@/components/ui/Button/Button";

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
            <div className="py-20 bg-gray-100">
                <div className="grid gap-7 container mx-auto">
                    <div className="flex justify-between items-center">
                        <h4 className="text-3xl font-medium">
                            Browse By Category
                        </h4>
                        <div className="flex items-center gap-5 text-2xl">
                            <button>
                                <FaChevronLeft />
                            </button>
                            <button>
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-5">
                        {initialCategoriesData.map((category, i) => (
                            <div
                                key={i}
                                className="grid justify-items-center gap-5 w-full p-5 bg-gray-200 rounded-xl"
                            >
                                <category.icon className="text-5xl" />
                                <span className="text-xl font-medium">
                                    {category.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid gap-7 container mx-auto py-10">
                <div className="flex gap-10">
                    {initialTabsData.map((tab, i) => (
                        <div
                            key={i}
                            className={`text-xl font-medium cursor-pointer ${
                                activeTab === i
                                    ? "text-black border-b-[3px] border-black"
                                    : "text-gray-500"
                            }`}
                            onClick={() => handleChangeActiveTab(i)}
                        >
                            <span>{tab}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-5">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="grid justify-items-center gap-3 p-8 bg-gray-100 rounded-md cursor-pointer"
                        >
                            <FaRegHeart className="justify-self-end text-3xl text-gray-500" />
                            <Image
                                src="/product_image_thumb.png"
                                alt="image"
                                width={300}
                                height={300}
                            />
                            <span className="text-center text-lg font-medium">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit
                            </span>
                            <span className="text-3xl font-semibold">$999</span>
                            <Button theme="dark" text="Buy now" inline />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
