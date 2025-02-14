import {
    colorsData,
    descrData,
    detailsSpecsData,
    discountData,
    imagesData,
    infoData,
    priceData,
    reviewsData,
    specsData,
    storageData,
    titleData,
} from "./page.data";

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

export default function ProductPage() {
    return (
        <>
            <section className="md:flex gap-5 lg:gap-16 container mx-auto">
                <ProductImageGallery images={imagesData} />
                <div className="grid content-start gap-4 md:gap-8 w-full mt-3 px-3 md:px-5">
                    <ProductTitle title={titleData} />
                    <ProductPrice price={priceData} discount={discountData} />
                    <ColorSelector colorsData={colorsData} />
                    <StorageSelector storageData={storageData} />
                    <ProductSpecs specsData={specsData} />
                    <ProductDescription descr={descrData} isShowMore />
                    <div className="grid lg:flex items-center gap-3 md:gap-5">
                        <Button
                            href=""
                            theme="dark"
                            text="Add to Wishlist"
                            inline
                            className="w-full text-center"
                        />
                        <Button
                            href=""
                            theme="dark"
                            text="Add to Card"
                            className="w-full text-center"
                        />
                    </div>
                    <ProductInfo infoData={infoData} />
                </div>
            </section>
            <section className="px-3 md:px-5 py-10 bg-gray-100">
                <div className="grid gap-8 container mx-auto p-6 md:p-10 bg-white rounded-lg">
                    <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                        Details
                    </h4>
                    <ProductDescription descr={descrData} />
                    <DetailsSpecs specsData={detailsSpecsData} />
                </div>
            </section>
            <section className="grid gap-10 container mx-auto px-3 md:px-5 py-10">
                <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                    Reviews
                </h4>
                <RatingSummary reviewsData={reviewsData} />
                <ReviewList reviewsData={reviewsData} />
            </section>
        </>
    );
}
