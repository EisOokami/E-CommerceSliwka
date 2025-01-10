"use client";

import { useEffect, useState } from "react";
import CarouselClient from "@/components/ui/carouselClient/CarouselClient";

const initialImagesData = [
    {
        src: "/product_image_thumb.png",
        alt: "Image1",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image2",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image3",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image4",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image5",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image6",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
    {
        src: "/product_image_thumb.png",
        alt: "Image7",
        name: "Lorem, ipsum.",
        descr: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat nisi corrupti magnam?",
    },
];

const initialOptionsDesktop = {
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
    }, []);

    return (
        <section>
            {screenWidth < 750 ? (
                <CarouselClient
                    imagesData={initialImagesData}
                    options={initialOptionsMobile}
                    width={350}
                    height={350}
                />
            ) : (
                <CarouselClient
                    imagesData={initialImagesData}
                    options={initialOptionsDesktop}
                    width={500}
                    height={500}
                />
            )}
        </section>
    );
}
