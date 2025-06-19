import { getHomePageData } from "@/data/loaders";

import Hero from "@/components/layout/home/hero/Hero";
import FeatureProducts from "@/components/layout/home/featureProducts/FeatureProducts";
import Products from "@/components/layout/home/products/Products";
import ProductsCarouselSection from "@/components/layout/home/productsCarouselSection/ProductsCarouselSection";
import DiscountsShowcase from "@/components/layout/home/discountsShowcase/DiscountsShowcase";

export default async function HomePage() {
    const strapiData = await getHomePageData();
    const { blocks } = strapiData?.data || [];

    return (
        <main>
            <Hero data={blocks[0]} />
            <FeatureProducts data={blocks[1]} />
            <Products data={blocks[4]} />
            <ProductsCarouselSection data={blocks[3]} />
            <DiscountsShowcase data={blocks[2]} />
        </main>
    );
}
