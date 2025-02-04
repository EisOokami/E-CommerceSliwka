"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useRef } from "react";
import Image from "next/image";
import { ProductImageGalleryProps } from "./ProductImageGallery.interfaces";

export default function ProductImageGallery({
    images,
}: ProductImageGalleryProps) {
    const mainRef = useRef<Splide>(null);
    const thumbnailRef = useRef<Splide>(null);

    const mainOptions = {
        type: "loop",
        perPage: 1,
        perMove: 1,
        gap: "1rem",
        pagination: false,
        height: "27em",
    };

    const thumbnailOptions = {
        perPage: 4,
        perMove: 1,
        height: "100%",
        pagination: false,
        direction: "ttb",
        focus: "center",
    };

    const handleThumbs = (id: number) => {
        if (mainRef.current) {
            mainRef.current.go(id);
        }
    };

    const handleMain = (id: number) => {
        if (thumbnailRef.current) {
            thumbnailRef.current.go(id);
        }
    };

    return (
        <section className="flex w-full">
            <Splide options={thumbnailOptions} ref={thumbnailRef}>
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
                className="max-w-5xl grid place-content-center"
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
        </section>
    );
}
