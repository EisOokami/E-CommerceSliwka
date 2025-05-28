import Image from "next/image";
import styles from "./ProductCarousel.module.scss";
import { ProductCarouselThumbsProps } from "./ProductCarousel.interfaces";

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
                <Image
                    width={200}
                    height={200}
                    src={`${process.env.NEXT_PUBLIC_DB_URL}${image.url}`}
                    alt={image.alternativeText ?? ""}
                />
            </button>
        </div>
    );
}
