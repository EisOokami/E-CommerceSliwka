"use client";

import { useState } from "react";
import { CatalogProps } from "./Catalog.interfaces";
import { IProduct } from "@/interfaces/interfaces";

import AccordionContainer from "@/components/layout/catalog/accordionContainer/AccordionContainer";
import Products from "@/components/layout/catalog/products/Products";
import RatingSelect from "@/components/ui/ratingSelect/RatingSelect";

export default function Catalog({
    limit,
    totalPages,
    setTotalPages,
    currentPage,
    productsCount,
    setProductsCount,
}: CatalogProps) {
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [productRating, setProductRating] = useState<string>("all");

    return (
        <section className="grid md:flex md:items-start gap-5 container mx-auto px-3 md:px-5">
            <div className="md:self-start flex md:block justify-between items-center gap-5 md:w-1/3">
                <AccordionContainer
                    setFilteredProducts={setFilteredProducts}
                    productRating={productRating}
                    limit={limit}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                    productsCount={productsCount}
                    setProductsCount={setProductsCount}
                />
                <div className="block md:hidden w-full">
                    <RatingSelect setProductRating={setProductRating} />
                </div>
            </div>
            <Products
                productsData={filteredProducts}
                setProductRating={setProductRating}
                productsCount={productsCount}
            />
        </section>
    );
}
