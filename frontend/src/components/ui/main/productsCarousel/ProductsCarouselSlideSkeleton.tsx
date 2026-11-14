import styles from "./ProductsCarousel.module.scss";

export default function ProductsCarouselSlideSkeleton() {
    return (
        <div className={styles["embla__slide"]}>
            <div className="flex flex-col justify-between gap-5 h-full p-8 bg-gray-100 animate-pulse">
                <div className="grid gap-3">
                    <div className="justify-self-center self-center grid place-content-center w-full h-40 sm:h-48 md:h-80">
                        <div className="w-40 sm:w-48 md:w-64 lg:w-72 h-40 sm:h-48 md:h-80 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="grid content-start gap-5">
                        <div className="w-40 md:w-56 xl:w-72 h-6 md:h-7 xl:h-9 bg-gray-200 rounded"></div>
                        <div className="grid gap-2">
                            <div className="w-full h-3 bg-gray-200 rounded"></div>
                            <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                            <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="w-28 md:w-36 h-10 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
}
