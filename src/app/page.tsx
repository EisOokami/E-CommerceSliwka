import DiscountsShowcase from "@/components/layout/home/discountsShowcase/DiscountsShowcase";
import Hero from "@/components/layout/home/hero/Hero";
import Products from "@/components/layout/home/products/Products";
import ProductsCarousel from "@/components/layout/home/productsCarousel/ProductsCarousel";

export default function Home() {
    return (
        <>
            <Hero />
            <Products />
            <ProductsCarousel />
            <DiscountsShowcase />
        </>
    );
}
