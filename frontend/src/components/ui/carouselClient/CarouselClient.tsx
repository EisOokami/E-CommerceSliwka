"use client";

import Image from "next/image";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import "@splidejs/splide/css/skyblue";
import "@splidejs/splide/css/sea-green";
import "@splidejs/splide/css/core";
import { CarouselClientProps } from "./CarouselClient.interfaces";

import Button from "@/components/ui/button/Button";

export default function CarouselClient({
    productsData,
    options,
    width,
    height,
}: Readonly<CarouselClientProps>) {
    return (
        <Splide options={options} hasTrack={false}>
            <SplideTrack>
                {productsData.map((product) => (
                    <SplideSlide key={product.documentId}>
                        <div className="flex flex-col justify-between gap-5 p-8 bg-gray-100 h-full">
                            <div className="justify-self-center self-center grid place-content-center h-1/2">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_DB_URL}${product.image.url}`}
                                    alt={
                                        product.image.alternativeText ??
                                        product.name
                                    }
                                    width={width}
                                    height={height}
                                    className="h-fit"
                                />
                            </div>
                            <div className="grid gap-3 h-1/2">
                                <div className="grid content-start gap-5">
                                    <h4 className="text-2xl md:text-xl xl:text-4xl">
                                        {product.name}
                                    </h4>
                                    <p className="text-gray-500 text-pretty">
                                        {product.description}
                                    </p>
                                </div>
                                <Button
                                    href={`/catalog/${product.documentId}`}
                                    theme="dark"
                                    text="Shop now"
                                    className="self-end"
                                    inline
                                    isLink
                                />
                            </div>
                        </div>
                    </SplideSlide>
                ))}
            </SplideTrack>
        </Splide>
    );
}
