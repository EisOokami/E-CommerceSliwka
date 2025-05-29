"use client";

import useEmblaCarousel from "embla-carousel-react";

import { IconType } from "react-icons";
import { FaGamepad } from "react-icons/fa";
import { FaHeadphones, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoPhonePortraitOutline, IoWatch } from "react-icons/io5";
import { BsCamera2 } from "react-icons/bs";
import { HiComputerDesktop } from "react-icons/hi2";
import { IoIosLaptop } from "react-icons/io";
import { TbDotsCircleHorizontal } from "react-icons/tb";

import styles from "./CategoriesCarousel.module.scss";
import { CategoriesCarouselProps } from "./CategoriesCarousel.interfaces";
import { usePrevNextButtons } from "../../../hooks/UsePrevNextButtons";

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

export default function CategoriesCarousel({
    categoriesData,
    activeCategory,
    setActiveCategory,
    setProductsData,
    tabsData,
    activeTab,
}: CategoriesCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        align: "start",
    });

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

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
        <div className="grid gap-7 container mx-auto p-3 md:p-0">
            <div className="flex justify-between items-center">
                <h4 className="text-2xl md:text-3xl font-medium">
                    Browse By Category
                </h4>
                <div className="flex items-center gap-2 text-xl md:text-2xl">
                    <button
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                        className={`p-2 transition rounded-full ${
                            !prevBtnDisabled
                                ? "hover:bg-gray-300"
                                : "cursor-not-allowed"
                        }`}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                        className={`p-2 transition rounded-full ${
                            !nextBtnDisabled
                                ? "hover:bg-gray-300"
                                : "cursor-not-allowed"
                        }`}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
            <div className={styles["embla"]}>
                <div className={styles["embla__viewport"]} ref={emblaRef}>
                    <div className={styles["embla__container"]}>
                        {categoriesData.map((category) => {
                            const Icon =
                                initialCategoriesData[
                                    category.category.toLowerCase()
                                ];

                            return (
                                <div
                                    key={category.id}
                                    className={`${styles["embla__slide"]} ${
                                        activeCategory === category.category
                                            ? "bg-gray-300"
                                            : "bg-gray-200"
                                    } grid justify-items-center gap-2 p-3 md:p-5 hover:bg-gray-300 rounded-xl cursor-pointer transition`}
                                    onClick={() =>
                                        handleChangeActiveCategory(
                                            category.category,
                                        )
                                    }
                                >
                                    <Icon className="text-3xl md:text-5xl" />
                                    <span className="text-base md:text-xl font-medium">
                                        {category.category}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
        // <div className="grid xl:flex grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:justify-between xl:items-center gap-5">
        //     {categoriesData.map((category) => {
        //         const Icon =
        //             initialCategoriesData[category.category.toLowerCase()];

        //         return (
        //             <div
        //                 key={category.id}
        //                 className={`grid justify-items-center gap-2 md:gap-5 w-full p-3 md:p-5 hover:bg-gray-300 rounded-xl cursor-pointer transition ${
        //                     activeCategory === category.category
        //                         ? "bg-gray-300"
        //                         : "bg-gray-200"
        //                 }`}
        //                 onClick={() =>
        //                     handleChangeActiveCategory(category.category)
        //                 }
        //             >
        //                 <Icon className="text-3xl md:text-5xl" />
        //                 <span className="text-base md:text-xl font-medium">
        //                     {category.category}
        //                 </span>
        //             </div>
        //         );
        //     })}
        // </div>
    );
}
