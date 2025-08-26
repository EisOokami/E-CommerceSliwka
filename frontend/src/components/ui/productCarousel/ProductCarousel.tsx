"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { getStrapiMedia } from "@/lib/utils";
import styles from "./ProductCarousel.module.scss";
import { ProductCarouselProps } from "./ProductCarousel.interfaces";

import ProductImageThumbs from "./ProductCarouselThumbs";

export default function ProductCarousel({
    images,
}: Readonly<ProductCarouselProps>) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) {
                return;
            }

            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi],
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) {
            return;
        }

        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaMainApi) {
            return;
        }

        onSelect();

        emblaMainApi.on("select", onSelect).on("reInit", onSelect);
    }, [emblaMainApi, onSelect]);

    return (
        <section className={styles["embla"]}>
            <div className={styles["embla__viewport"]} ref={emblaMainRef}>
                <div className={styles["embla__container"]}>
                    {images.map((image, i) => (
                        <div className={styles["embla__slide"]} key={i}>
                            <PhotoProvider>
                                <PhotoView src={`${getStrapiMedia(image.url)}`}>
                                    <Image
                                        className={
                                            styles["embla__slide__images"]
                                        }
                                        src={`${getStrapiMedia(image.url)}`}
                                        alt={image.alternativeText ?? ""}
                                        width={1000}
                                        height={1000}
                                    />
                                </PhotoView>
                            </PhotoProvider>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={styles["embla-thumbs__viewport"]}
                ref={emblaThumbsRef}
            >
                <div className={styles["embla-thumbs__container"]}>
                    {images.map((image, i) => (
                        <ProductImageThumbs
                            key={i}
                            onClick={() => onThumbClick(i)}
                            selected={i === selectedIndex}
                            image={image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
