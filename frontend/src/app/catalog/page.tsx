"use client";

import { useEffect, useState } from "react";
import useCatalogStore from "@/stores/catalog";
import { usePathname } from "next/navigation";
import { IProduct } from "@/interfaces/interfaces";

import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import Pagination from "@/components/ui/pagination/Pagination";
import AccordionContainer from "@/components/layout/catalog/accordionContainer/AccordionContainer";
import Products from "@/components/layout/catalog/products/Products";
import RatingSelect from "@/components/ui/ratingSelect/RatingSelect";

export default function CatalogPage() {
    const currentPage = useCatalogStore((state) => state.currentPage);
    const setCurrentPage = useCatalogStore((state) => state.setCurrentPage);
    const totalPages = useCatalogStore((state) => state.totalPages);
    const setSearchValue = useCatalogStore((state) => state.setSearchValue);
    const setProductRating = useCatalogStore((state) => state.setProductRating);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/catalog") {
            setProductRating("all");
            setSearchValue("");
            setCurrentPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <>
            <section className="container mx-auto px-5">
                <Breadcrumb />
            </section>
            <section className="grid md:flex md:items-start gap-5 container mx-auto px-5">
                <div className="md:self-start flex md:block justify-between items-center gap-5 md:w-1/3">
                    <AccordionContainer
                        setFilteredProducts={setFilteredProducts}
                    />
                    <div className="block md:hidden w-full">
                        <RatingSelect />
                    </div>
                </div>
                <Products productsData={filteredProducts} />
            </section>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    );
}
