import styles from "./ProductCarousel.module.scss";
import { ProductCarouselThumbsProps } from "./ProductCarousel.interfaces";

import AppImage from "../appImage/AppImage";

export default function ProductCarouselThumbs({
    selected,
    image,
    onClick,
}: Readonly<ProductCarouselThumbsProps>) {
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
                <AppImage
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
