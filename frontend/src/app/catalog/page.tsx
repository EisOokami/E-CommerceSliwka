"use client";

import { Suspense, useState } from "react";

import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import Catalog from "@/components/layout/catalog/Catalog";
import Pagination from "@/components/ui/pagination/Pagination";

const limit = 8;

export default function CatalogPage() {
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsCount, setProductsCount] = useState<number>(0);

    return (
        <>
            <section className="container mx-auto px-3 md:px-5">
                <Breadcrumb />
            </section>
            <Suspense fallback={<p>Loading products...</p>}>
                <Catalog
                    limit={limit}
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                    currentPage={currentPage}
                    productsCount={productsCount}
                    setProductsCount={setProductsCount}
                />
            </Suspense>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    );
}
