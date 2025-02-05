"use client";

import { useRef } from "react";
import Image from "next/image";
import { Options, Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { ProductImageGalleryProps } from "./ProductImageGallery.interfaces";

export default function ProductImageGallery({
    images,
}: ProductImageGalleryProps) {
    const mainRef = useRef<Splide>(null);
    const thumbnailColumnRef = useRef<Splide>(null);
    const thumbnailRowRef = useRef<Splide>(null);

    const mainOptions: Options = {
        type: "loop",
        perPage: 1,
        perMove: 1,
        gap: "1rem",
        pagination: false,
        height: "27em",
    };

    const thumbnailColumnOptions: Options = {
        perPage: 4,
        perMove: 1,
        height: "100%",
        pagination: false,
        direction: "ttb",
        isNavigation: true,
    };

    const thumbnailRowOptions: Options = {
        perPage: 4,
        perMove: 1,
        width: "100%",
        height: "100%",
        pagination: false,
        isNavigation: true,
    };

    const handleThumbs = (id: number) => {
        if (mainRef.current) {
            mainRef.current.go(id);
        }
    };

    const handleMain = (id: number) => {
        if (thumbnailColumnRef.current) {
            thumbnailColumnRef.current.go(id);
        }

        if (thumbnailRowRef.current) {
            thumbnailRowRef.current.go(id);
        }
    };

    return (
        <section className="lg:flex items-start w-full md:w-1/2 lg:w-full">
            <Splide
                options={thumbnailColumnOptions}
                ref={thumbnailColumnRef}
                className="hidden lg:block h-2/3"
            >
                {images.map((image, index) => (
                    <SplideSlide
                        key={image.alt}
                        className="grid place-content-center first:place-content-end last:place-content-start"
                    >
                        <button
                            onClick={() => handleThumbs(index)}
                            className="w-28"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={1000}
                                height={1000}
                            />
                        </button>
                    </SplideSlide>
                ))}
            </Splide>
            <Splide
                options={mainOptions}
                ref={mainRef}
                onMove={(splide: Splide, newIndex: number) =>
                    handleMain(newIndex)
                }
                className="grid place-content-center max-w-5xl w-svw md:w-auto"
            >
                {images.map((image) => (
                    <SplideSlide key={image.alt}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={1000}
                            height={1000}
                            className="h-full object-contain"
                        />
                    </SplideSlide>
                ))}
            </Splide>
            <Splide
                options={thumbnailRowOptions}
                ref={thumbnailRowRef}
                className="lg:hidden w-svw"
            >
                {images.map((image, index) => (
                    <SplideSlide
                        key={image.alt}
                        className="grid place-items-center !h-auto"
                    >
                        <button
                            onClick={() => handleThumbs(index)}
                            className="w-20 lg:w-28"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={1000}
                                height={1000}
                            />
                        </button>
                    </SplideSlide>
                ))}
            </Splide>
        </section>
    );
}
