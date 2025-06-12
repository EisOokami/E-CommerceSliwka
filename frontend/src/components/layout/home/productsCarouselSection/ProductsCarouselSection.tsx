import { EmblaOptionsType } from "embla-carousel";
import { ProductsCarouselSectionProps } from "./ProductsCarouselSection.interfaces";

import ProductsCarousel from "@/components/ui/productsCarousel/ProductsCarousel";

const options: EmblaOptionsType = {
    loop: true,
    dragFree: true,
};

export default function ProductsCarouselSection({
    data,
}: Readonly<{ data: ProductsCarouselSectionProps }>) {
    const { products } = data;

    return (
        <section>
            <ProductsCarousel productsData={products} options={options} />
        </section>
    );
}
