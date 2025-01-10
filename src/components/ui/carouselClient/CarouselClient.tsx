"use client";

import Image from "next/image";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import "@splidejs/splide/css/skyblue";
import "@splidejs/splide/css/sea-green";
import "@splidejs/splide/css/core";
import Button from "@/components/ui/button/Button";

interface CarouselClientProps {
    imagesData: { src: string; alt: string; descr: string }[];
    options: unknown;
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}

export default function CarouselClient({
    imagesData,
    options,
    width,
    height,
}: CarouselClientProps) {
    return (
        <Splide options={options} hasTrack={false}>
            <SplideTrack>
                {imagesData.map((imageData, i) => (
                    <SplideSlide key={i}>
                        <div className="grid gap-5 p-8 bg-gray-100">
                            <Image
                                src={imageData.src}
                                alt={imageData.alt}
                                width={width}
                                height={height}
                                className="justify-self-center"
                            />
                            <span className="text-gray-500">
                                {imageData.descr}
                            </span>
                            <Button theme="dark" text="Shop now" inline />
                        </div>
                    </SplideSlide>
                ))}
            </SplideTrack>
        </Splide>
    );
}
