"use client";

import Image from "next/image";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import "@splidejs/splide/css/skyblue";
import "@splidejs/splide/css/sea-green";
import "@splidejs/splide/css/core";
import Button from "@/components/ui/button/Button";

interface CarouselClientProps {
    productsData: {
        src: string;
        alt: string;
        name: string;
        descr: string;
        href: string;
    }[];
    options: unknown;
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}

export default function CarouselClient({
    productsData,
    options,
    width,
    height,
}: CarouselClientProps) {
    return (
        <Splide options={options} hasTrack={false}>
            <SplideTrack>
                {productsData.map((product, i) => (
                    <SplideSlide key={i}>
                        <div className="grid gap-5 p-8 bg-gray-100">
                            <Image
                                src={product.src}
                                alt={product.alt}
                                width={width}
                                height={height}
                                className="justify-self-center"
                            />
                            <h4 className="text-2xl md:text-xl xl:text-4xl">
                                {product.name}
                            </h4>
                            <span className="text-gray-500">
                                {product.descr}
                            </span>
                            <Button
                                href={product.href}
                                theme="dark"
                                text="Shop now"
                                inline
                            />
                        </div>
                    </SplideSlide>
                ))}
            </SplideTrack>
        </Splide>
    );
}
