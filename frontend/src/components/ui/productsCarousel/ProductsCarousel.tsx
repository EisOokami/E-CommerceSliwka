"use client";

import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import styles from "./ProductsCarousel.module.scss";
import { ProductsCarouselProps } from "./ProductsCarousel.interfaces";

import ProductsCarouselSlideSkeleton from "./ProductsCarouselSlideSkeleton";
const ProductsCarouselSlide = dynamic(() => import("./ProductsCarouselSlide"), {
    ssr: false,
    loading: () => <ProductsCarouselSlideSkeleton />,
});

export default function ProductsCarousel({
    productsData,
    options,
}: Readonly<ProductsCarouselProps>) {
    const [emblaRef] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 2000, stopOnInteraction: false }),
    ]);

    return (
        <div className="w-full m-auto">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className={styles["embla__container"]}>
                    {productsData.map((product) => (
                        <ProductsCarouselSlide
                            key={product.documentId}
                            product={product}
                        />
                    ))}
                    {productsData.length < 7 &&
                        productsData.map((product) => (
                            <ProductsCarouselSlide
                                key={product.id + product.documentId}
                                product={product}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
