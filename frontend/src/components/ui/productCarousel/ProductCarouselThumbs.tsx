import styles from "./ProductCarousel.module.scss";
import { ProductCarouselThumbsProps } from "./ProductCarousel.interfaces";

import StrapiImage from "../strapiImage/StrapiImage";

export default function ProductCarouselThumbs({
    selected,
    image,
    onClick,
}: ProductCarouselThumbsProps) {
    return (
        <div
            className={`${styles["embla-thumbs__slide"]}
            ${selected ? " " + styles["embla-thumbs__slide--selected"] : ""}`}
        >
            <button
                onClick={onClick}
                type="button"
                className={styles["embla__slide__inner"]}
            >
                <StrapiImage
                    width={200}
                    height={200}
                    src={image.url}
                    alt={image.alternativeText ?? ""}
                    className={styles["embla-thumbs__images"]}
                />
            </button>
        </div>
    );
}
