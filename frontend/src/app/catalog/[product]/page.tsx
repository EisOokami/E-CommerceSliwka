import { getStoreProductData } from "@/data/loaders";
import { ProductPageProps } from "./page.interfaces";
import { IStore } from "@/interfaces/interfaces";

import ColorSelector from "@/components/ui/colorSelector/ColorSelector";
import ProductImageGallery from "@/components/ui/productImageGallery/ProductImageGallery";
import ProductSpecs from "@/components/ui/productSpecs/ProductSpecs";
import StorageSelector from "@/components/ui/storageSelector/StorageSelector";
import ProductDescription from "@/components/layout/product/productDescription/ProductDescription";
import Button from "@/components/ui/button/Button";
import ProductInfo from "@/components/layout/product/productInfo/ProductInfo";
import ProductTitle from "@/components/layout/product/productTitle/ProductTitle";
import ProductPrice from "@/components/layout/product/productPrice/ProductPrice";
import DetailsSpecs from "@/components/layout/product/detailsSpecs/DetailsSpecs";
import RatingSummary from "@/components/ui/ratingSummary/RatingSummary";
import ReviewList from "@/components/layout/product/reviewList/ReviewList";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";

export default async function ProductPage({ params }: ProductPageProps) {
    const { product } = await params;
    const strapiData: IStore = await getStoreProductData(product);

    return (
        <>
            <section className="container mx-auto px-3 md:px-5">
                <Breadcrumb customSlug={strapiData.name} />
            </section>
            <section className="md:flex gap-5 lg:gap-16 container mx-auto">
                <ProductImageGallery images={strapiData.sliderImages} />
                <div className="grid content-start gap-4 md:gap-8 w-full mt-3 px-3 md:px-5">
                    <ProductTitle title={strapiData.name} />
                    <ProductPrice
                        price={strapiData.price}
                        isDiscount={strapiData.isDiscount}
                        discount={strapiData.discountedPrice}
                    />
                    <ColorSelector colorsData={strapiData.colors} />
                    <StorageSelector storageData={strapiData.options} />
                    <ProductSpecs specsData={strapiData.productSpecs} />
                    <ProductDescription
                        descr={strapiData.description}
                        isShowMore
                    />
                    <div className="grid lg:flex items-center gap-3 md:gap-5">
                        <Button
                            theme="dark"
                            text="Add to Wishlist"
                            inline
                            className="w-full text-center"
                        />
                        <Button
                            theme="dark"
                            text="Add to Card"
                            className="w-full text-center"
                        />
                    </div>
                    <ProductInfo infoData={strapiData.productInfo} />
                </div>
            </section>
            <section className="px-3 md:px-5 py-10 bg-gray-100">
                <div className="grid gap-8 container mx-auto p-6 md:p-10 bg-white rounded-lg">
                    <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                        Details
                    </h4>
                    <ProductDescription descr={strapiData.description} />
                    <DetailsSpecs
                        specsData={strapiData.detailedSpecifications}
                    />
                </div>
            </section>
            <section className="grid gap-10 container mx-auto px-3 md:px-5 py-10">
                <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Reviews
                </h4>
                <RatingSummary
                    reviewsData={strapiData.reviews}
                    averageRating={strapiData.averageRating}
                />
                <ReviewList reviewsData={strapiData.reviews} />
            </section>
        </>
    );
}
