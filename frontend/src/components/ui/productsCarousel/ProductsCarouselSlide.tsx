import styles from "./ProductsCarousel.module.scss";
import { ProductsCarouselSlideProps } from "./ProductsCarousel.interfaces";

import Button from "../button/Button";
import StrapiImage from "../strapiImage/StrapiImage";

export default function ProductsCarouselSlide({
    product,
}: Readonly<ProductsCarouselSlideProps>) {
    return (
        <div className={styles["embla__slide"]} key={product.id}>
            <div className="flex flex-col justify-between gap-5 h-full p-8 bg-gray-100 select-none">
                <div className="grid gap-3">
                    <div className="justify-self-center self-center grid place-content-center h-40 sm:h-48 md:h-80">
                        <StrapiImage
                            src={product.image.url}
                            alt={product.image.alternativeText ?? product.name}
                            width={400}
                            height={400}
                            className="h-40 sm:h-48 md:h-80 object-contain"
                        />
                    </div>
                    <div className="grid content-start gap-5">
                        <h4 className="text-2xl md:text-xl xl:text-4xl break-words">
                            {product.name}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 text-pretty">
                            {product.description.slice(0, 250)}
                            {product.description.length > 250 ? "..." : ""}
                        </p>
                    </div>
                </div>
                <Button
                    href={`/catalog/${product.slug}`}
                    theme="dark"
                    text="Shop now"
                    inline
                    isLink
                />
            </div>
        </div>
    );
}
