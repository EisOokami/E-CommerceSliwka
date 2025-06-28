"use client";

import { memo, useEffect, useState } from "react";
import useCatalogStore from "@/stores/catalog";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Pagination = memo(function Pagination() {
    const currentPage = useCatalogStore((state) => state.currentPage);
    const setCurrentPage = useCatalogStore((state) => state.setCurrentPage);
    const totalPages = useCatalogStore((state) => state.totalPages);
    const [screenWidth, setScreenWidth] = useState<number>(500);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setScreenWidth(window.innerWidth);
            };

            setScreenWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [screenWidth]);

    return (
        <div>
            <ResponsivePagination
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
                maxWidth={screenWidth / 4}
                extraClassName="justify-content-center gap-1 md:gap-2"
                pageItemClassName="text-sm md:text-base text-black bg-gray-100 rounded-md"
                pageLinkClassName="block px-4 py-2"
                previousClassName="!flex !justify-center !items-center !p-0 !bg-white hover:!bg-gray-100 transition"
                nextClassName="!flex !justify-center !items-center !p-0 !bg-white hover:!bg-gray-100 transition"
                activeItemClassName="text-white !bg-black"
                disabledItemClassName="bg-transparent px-1 md:px-4"
                navClassName="bg-transparent mt-1 !px-1 md:!px-4"
                previousLabel={<GoChevronLeft />}
                nextLabel={<GoChevronRight />}
            />
        </div>
    );
});

export default Pagination;
