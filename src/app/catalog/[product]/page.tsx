import { MdOutlineSmartphone, MdOutlineCamera, MdCamera } from "react-icons/md";
import { GoCpu } from "react-icons/go";
import { IoBatteryFull } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { AiOutlineShop } from "react-icons/ai";
import { LuCircleCheckBig } from "react-icons/lu";

import ColorSelector from "@/components/ui/colorSelector/ColorSelector";
import ProductImageGallery from "@/components/ui/productImageGallery/ProductImageGallery";
import ProductSpecs from "@/components/ui/productSpecs/ProductSpecs";
import StorageSelector from "@/components/ui/storageSelector/StorageSelector";
import ProductDescription from "@/components/layout/product/productDescription/ProductDescription";
import Button from "@/components/ui/button/Button";
import ProductInfo from "@/components/layout/product/productInfo/ProductInfo";
import ProductTitle from "@/components/layout/product/productTitle/ProductTitle";
import ProductPrice from "@/components/layout/product/productPrice/ProductPrice";

const images = [
    { src: "/product_image_thumb.png", alt: "image1" },
    { src: "/macbook-air-hero.png", alt: "image2" },
    { src: "/ps5-hero.png", alt: "image3" },
    { src: "/vision-pro-hero.png", alt: "image4" },
    { src: "/vision-pro-hero.png", alt: "image5" },
    { src: "/vision-pro-hero.png", alt: "image6" },
    { src: "/vision-pro-hero.png", alt: "image7" },
];

const title = "Apple iPhone 16 Pro Max";
const price = "$1399";
const discount = "$1499";

const colorsData = ["#f4f4f4", "#555555", "#dcd5cb", "#f2e0d4"];

const storageData = ["256GB", "512GB", "1TB"];

const specsData = [
    {
        icon: MdOutlineSmartphone,
        title: "Screen size",
        spec: "6.7",
    },
    {
        icon: GoCpu,
        title: "CPU",
        spec: "Apple A18 Pro",
    },
    {
        icon: GoCpu,
        title: "Number of Cores",
        spec: "6",
    },
    {
        icon: MdOutlineCamera,
        title: "Main camera",
        spec: "48-48-12MP",
    },
    {
        icon: MdCamera,
        title: "Front camera",
        spec: "12MP",
    },
    {
        icon: IoBatteryFull,
        title: "Battery capacity",
        spec: "4,685 mAh",
    },
];

const descr =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore, sint, reiciendis nobis assumenda ea consequatur enim facilis ullam libero possimus? Laborum impedit quis nemo nihil eaque nulla soluta totam, tempora inventore tempore non consequuntur beatae aut eligendi dolorum perspiciatis ut vero. Asperiores, similique totam, voluptatum reiciendis architecto consectetur laboriosam aliquid amet expedita doloribus officiis dolores aliquam labore saepe earum facere modi eum vitae soluta laudantium! Soluta, in voluptatum. Error incidunt illum doloremque corporis velit eaque, accusantium asperiores optio laudantium veritatis suscipit assumenda vitae minus doloribus recusandae laboriosam neque odio molestiae repellendus. Quae totam repellendus perspiciatis velit molestiae quas. Delectus.";

const infoData = [
    {
        icon: TbTruckDelivery,
        title: "Free Delivery",
        info: "1-2 day",
    },
    {
        icon: AiOutlineShop,
        title: "Free Delivery",
        info: "Today",
    },
    {
        icon: LuCircleCheckBig,
        title: "Guaranteed",
        info: "1 year",
    },
];

export default function ProductPage() {
    return (
        <>
            <section className="md:flex gap-5 lg:gap-16 container mx-auto">
                <ProductImageGallery images={images} />
                <div className="grid content-start gap-4 md:gap-8 w-full px-3 md:px-5">
                    <ProductTitle title={title} />
                    <ProductPrice price={price} discount={discount} />
                    <ColorSelector colorsData={colorsData} />
                    <StorageSelector storageData={storageData} />
                    <ProductSpecs specsData={specsData} />
                    <ProductDescription descr={descr} isShowMore />
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
        </>
    );
}
