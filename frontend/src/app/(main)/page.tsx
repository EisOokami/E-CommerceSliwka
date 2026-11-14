import { heroSection, featureProductsSection } from "@/constants/homePage";
import { getHomePageData, getProductsCategory } from "@/data/main/loaders";

import Hero from "@/components/layout/main/home/hero/Hero";
import FeatureProducts from "@/components/layout/main/home/featureProducts/FeatureProducts";
import Products from "@/components/layout/main/home/products/Products";
import ProductsCarouselSection from "@/components/layout/main/home/productsCarouselSection/ProductsCarouselSection";
import DiscountsShowcase from "@/components/layout/main/home/discountsShowcase/DiscountsShowcase";

export default async function HomePage() {
    const [home, categories] = await Promise.all([
        getHomePageData(),
        getProductsCategory(),
    ]);

    return (
        <main>
            <Hero data={heroSection} />
            <FeatureProducts data={featureProductsSection} />
            <Products
                data={{
                    id: "products",
                    __component: "layout.products-section",
                    tabs: [
                        { id: "new", item: "New arrivals" },
                        { id: "rated", item: "Top rated" },
                        { id: "offers", item: "Latest offers" },
                    ],
                    categories: categories.map((item) => item.category),
                    newArrival: home.products,
                    bestseller: home.topRated,
                    featuredProducts: home.discounts,
                }}
            />
            {home.topRated.length > 0 && (
                <ProductsCarouselSection
                    data={{
                        id: "carousel",
                        __component: "layout.products-carousel-section",
                        products: home.topRated,
                    }}
                />
            )}
            <DiscountsShowcase
                data={{
                    id: "discounts",
                    __component: "layout.discounts",
                    products: home.discounts,
                }}
            />
        </main>
    );
}
