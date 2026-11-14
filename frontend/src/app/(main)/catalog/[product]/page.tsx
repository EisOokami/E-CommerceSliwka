import { notFound } from "next/navigation";
import { StoreApiError } from "@/data/main/services/http";
import { getProductData, getWishlistProductData } from "@/data/main/loaders";
import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";

import ColorSelector from "@/components/ui/main/colorSelector/ColorSelector";
import ProductCarousel from "@/components/ui/main/productCarousel/ProductCarousel";
import ProductSpecs from "@/components/ui/main/productSpecs/ProductSpecs";
import OptionsSelector from "@/components/ui/main/optionsSelector/OptionsSelector";
import ProductDescription from "@/components/layout/main/product/productDescription/ProductDescription";
import ProductInfo from "@/components/layout/main/product/productInfo/ProductInfo";
import ProductTitle from "@/components/layout/main/product/productTitle/ProductTitle";
import ProductPrice from "@/components/layout/main/product/productPrice/ProductPrice";
import DetailsSpecs from "@/components/layout/main/product/detailsSpecs/DetailsSpecs";
import RatingSummary from "@/components/ui/main/ratingSummary/RatingSummary";
import ReviewList from "@/components/layout/main/product/reviewList/ReviewList";
import Breadcrumb from "@/components/ui/main/breadcrumb/Breadcrumb";
import ActionsButton from "@/components/layout/main/product/actionsButton/ActionsButton";
import ReviewInput from "@/components/ui/main/reviewInput/ReviewInput";
import ProductStars from "@/components/ui/main/productStars/ProductStars";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ product: string }>;
}) {
    const { product } = await params;
    const productData = await getProductData(null, product).catch((error) => {
        if (error instanceof StoreApiError && error.status === 404) notFound();
        throw error;
    });
    const wishlistData = await getWishlistProductData(productData.id);
    const user = await getUserMeLoader();

    return (
        <>
            <section className="container mx-auto px-5">
                <Breadcrumb customSlug={productData.name} />
            </section>
            <section className="md:flex gap-5 lg:gap-16 container mx-auto">
                <ProductCarousel images={productData.sliderImages} />
                <div className="grid content-start gap-4 md:gap-8 w-full mt-3 px-5">
                    <div className="grid gap-5">
                        <ProductTitle title={productData.name} />
                        <ProductPrice
                            price={productData.price}
                            isDiscount={productData.isDiscount}
                            discount={productData.discountedPrice}
                        />
                        <ProductStars
                            averageRating={productData.averageRating}
                        />
                    </div>
                    <div className="grid gap-5">
                        <ColorSelector productData={productData} />
                        <OptionsSelector productData={productData} />
                        <ProductSpecs specsData={productData.productSpecs} />
                        <ProductDescription
                            descr={productData.description}
                            isShowMore
                        />
                        <ActionsButton
                            productData={productData}
                            wishlistData={wishlistData}
                        />
                        <ProductInfo infoData={productData.productInfo} />
                    </div>
                </div>
            </section>
            <section className="px-5 py-10 bg-gray-100">
                <div className="grid gap-8 container mx-auto p-6 md:p-10 bg-white rounded-lg">
                    <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                        Details
                    </h4>
                    <ProductDescription descr={productData.description} />
                    <DetailsSpecs
                        specsData={productData.detailedSpecifications}
                    />
                </div>
            </section>
            <section className="grid gap-10 container mx-auto px-5 py-10">
                <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Reviews
                </h4>
                <RatingSummary
                    reviewsData={productData.reviews}
                    averageRating={productData.averageRating}
                />
                <ReviewInput productData={productData} user={user} />
                <ReviewList productData={productData} user={user} />
            </section>
        </>
    );
}
