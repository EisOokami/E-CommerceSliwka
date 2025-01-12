"use client";

import { useEffect, useState } from "react";
import CarouselClient from "@/components/ui/carouselClient/CarouselClient";

const initialProductsData = [
    {
        src: "/product_image_thumb.png",
        alt: "Image1",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image2",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image3",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image4",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image5",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image6",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image7",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
        href: "/catalog",
    },
];

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

export default function ProductsCarousel() {
    const [screenWidth, setScreenWidth] = useState<number>(750);

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
                    productsData={initialProductsData}
                    options={initialOptionsMobile}
                    width={350}
                    height={350}
                />
            )}
            {screenWidth > 750 && screenWidth < 1500 && (
                <CarouselClient
                    productsData={initialProductsData}
                    options={initialOptionsLaptop}
                    width={350}
                    height={350}
                />
            )}
            {screenWidth > 1500 && (
                <CarouselClient
                    productsData={initialProductsData}
                    options={initialOptionsDesktop}
                    width={350}
                    height={350}
                />
            )}
        </section>
    );
}
