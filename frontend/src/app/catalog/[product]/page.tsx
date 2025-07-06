import { Toaster } from "react-hot-toast";
import { getProductData, getWishlistProductData } from "@/data/loaders";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import { ProductPageProps } from "./page.interfaces";
import { IProduct, IWishlist } from "@/interfaces/interfaces";

import ColorSelector from "@/components/ui/colorSelector/ColorSelector";
import ProductCarousel from "@/components/ui/productCarousel/ProductCarousel";
import ProductSpecs from "@/components/ui/productSpecs/ProductSpecs";
import OptionsSelector from "@/components/ui/optionsSelector/OptionsSelector";
import ProductDescription from "@/components/layout/product/productDescription/ProductDescription";
import ProductInfo from "@/components/layout/product/productInfo/ProductInfo";
import ProductTitle from "@/components/layout/product/productTitle/ProductTitle";
import ProductPrice from "@/components/layout/product/productPrice/ProductPrice";
import DetailsSpecs from "@/components/layout/product/detailsSpecs/DetailsSpecs";
import RatingSummary from "@/components/ui/ratingSummary/RatingSummary";
import ReviewList from "@/components/layout/product/reviewList/ReviewList";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import ActionsButton from "@/components/layout/product/actionsButton/ActionsButton";
import ReviewInput from "@/components/ui/reviewInput/ReviewInput";

export default async function ProductPage({ params }: ProductPageProps) {
    const { product } = await params;
    const productData: IProduct = await getProductData(null, product);
    const wishlistData: IWishlist = await getWishlistProductData(
        productData.documentId,
    );
    const user = await getUserMeLoader();

    return (
        <>
            <section className="container mx-auto px-5">
                <Breadcrumb customSlug={productData.name} />
            </section>
            <section className="md:flex gap-5 lg:gap-16 container mx-auto">
                <ProductCarousel images={productData.sliderImages} />
                <div className="grid content-start gap-4 md:gap-8 w-full mt-3 px-5">
                    <ProductTitle title={productData.name} />
                    <ProductPrice
                        price={productData.price}
                        isDiscount={productData.isDiscount}
                        discount={productData.discountedPrice}
                        colorsData={productData.colors}
                        optionsData={productData.options}
                    />
                    <ColorSelector colorsData={productData.colors} />
                    <OptionsSelector optionsData={productData.options} />
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
            <Toaster />
        </>
    );
}
