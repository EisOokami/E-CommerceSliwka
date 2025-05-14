"use client";

import { useEffect, useState } from "react";
import { ProductsCarouselProps } from "./ProductsCarousel.interfaces";

import CarouselClient from "@/components/ui/carouselClient/CarouselClient";

const initialOptionsDesktop = {
    type: "loop",
    autoplay: true,
    perPage: 4,
    perMove: 1,
    arrows: false,
    pagination: false,
};

const initialOptionsLaptop = {
    type: "loop",
    autoplay: true,
    perPage: 3,
    perMove: 1,
    arrows: false,
    pagination: false,
};

const initialOptionsMobile = {
    type: "loop",
    autoplay: true,
    perMove: 1,
    arrows: false,
};

export default function ProductsCarousel({
    data,
}: Readonly<{ data: ProductsCarouselProps }>) {
    const [screenWidth, setScreenWidth] = useState<number>(750);

    const { products } = data;

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
        <section>
            {screenWidth < 750 && (
                <CarouselClient
                    productsData={products}
                    options={initialOptionsMobile}
                    width={350}
                    height={350}
                />
            )}
            {screenWidth > 750 && screenWidth < 1500 && (
                <CarouselClient
                    productsData={products}
                    options={initialOptionsLaptop}
                    width={350}
                    height={350}
                />
            )}
            {screenWidth > 1500 && (
                <CarouselClient
                    productsData={products}
                    options={initialOptionsDesktop}
                    width={350}
                    height={350}
                />
            )}
        </section>
    );
}
