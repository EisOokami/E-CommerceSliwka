import DiscountsShowcase from "@/components/layout/discountsShowcase/DiscountsShowcase";
import Hero from "@/components/layout/hero/Hero";
import Products from "@/components/layout/products/Products";
import ProductsCarousel from "@/components/layout/productsCarousel/ProductsCarousel";

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
