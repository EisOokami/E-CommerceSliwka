"use client";

import { useCallback, useEffect, useState } from "react";
import useProductStore from "@/stores/product";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./ProductCarousel.module.scss";
import { ProductCarouselProps } from "./ProductCarousel.interfaces";

import ProductImageThumbs from "./ProductCarouselThumbs";
import StrapiImage from "../strapiImage/StrapiImage";

export default function ProductCarousel({
    images,
}: Readonly<ProductCarouselProps>) {
    const colorSliderImages = useProductStore(
        (state) => state.colorSliderImages,
    );
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
                    {colorSliderImages && colorSliderImages.length
                        ? colorSliderImages.map((image, i) => (
                              <div className={styles["embla__slide"]} key={i}>
                                  <StrapiImage
                                      className={styles["embla__slide__images"]}
                                      src={image.url}
                                      alt={image.alternativeText ?? ""}
                                      width={1000}
                                      height={1000}
                                  />
                              </div>
                          ))
                        : images.map((image, i) => (
                              <div className={styles["embla__slide"]} key={i}>
                                  <StrapiImage
                                      className={styles["embla__slide__images"]}
                                      src={image.url}
                                      alt={image.alternativeText ?? ""}
                                      width={1000}
                                      height={1000}
                                  />
                              </div>
                          ))}
                </div>
            </div>
            <div
                className={styles["embla-thumbs__viewport"]}
                ref={emblaThumbsRef}
            >
                <div className={styles["embla-thumbs__container"]}>
                    {colorSliderImages && colorSliderImages.length
                        ? colorSliderImages.map((image, i) => (
                              <ProductImageThumbs
                                  key={i}
                                  onClick={() => onThumbClick(i)}
                                  selected={i === selectedIndex}
                                  image={image}
                              />
                          ))
                        : images.map((image, i) => (
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
