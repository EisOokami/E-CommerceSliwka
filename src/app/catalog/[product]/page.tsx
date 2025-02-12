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
import DetailsSpecs from "@/components/layout/product/detailsSpecs/DetailsSpecs";

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

const detailsSpecsData = [
    {
        title: "Display",
        specs: [
            {
                name: "Type",
                value: [
                    "LTPO Super Retina XDR OLED",
                    "120Hz",
                    "HDR10",
                    "Dolby Vision",
                    "1000 nits (typ)",
                    "2000 nits (HBM)",
                ],
            },
            { name: "Size", value: "6.9 inches, 115.6 cm2" },
            { name: "Resolution", value: "1320 x 2868 pixels" },
            { name: "Size", value: "Ceramic Shield glass (2024 gen)" },
            { name: "", value: "Always-On display" },
        ],
    },
    {
        title: "Platform",
        specs: [
            { name: "OS", value: "iOS 18, upgradable to iOS ^18" },
            { name: "Chipset", value: "Apple A18 Pro (3 nm)" },
            { name: "CPU", value: "Hexa-core (2x4.05 GHz + 4x2.42 GHz)" },
            { name: "GPU", value: "Apple GPU (6-core graphics)" },
        ],
    },
    {
        title: "Main Camera",
        specs: [
            {
                name: "Triple",
                value: ["48 MP", "12 MP, 5x optical zoom", "48 MP"],
            },
            {
                name: "Features",
                value: "Dual-LED dual-tone flash, HDR (photo/panorama)",
            },
            {
                name: "Video",
                value: [
                    "4K@24/25/30/60/100/120fps",
                    "1080p@25/30/60/120/240fps",
                    "10-bit HDR, Dolby Vision HDR (up to 60fps)",
                    "ProRes",
                    "3D (spatial) video/audio, stereo sound rec",
                ],
            },
        ],
    },
];

export default function ProductPage() {
    return (
        <>
            <section className="md:flex gap-5 lg:gap-16 container mx-auto">
                <ProductImageGallery images={images} />
                <div className="grid content-start gap-4 md:gap-8 w-full mt-3 px-3 md:px-5">
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
            <section className="px-3 md:px-5 py-10 bg-gray-100">
                <div className="grid gap-8 container mx-auto p-6 md:p-10 bg-white rounded-lg">
                    <h4 className="text-2xl md:text-3xl xl:text-4xl font-medium">
                        Details
                    </h4>
                    <ProductDescription descr={descr} />
                    <DetailsSpecs specsData={detailsSpecsData} />
                </div>
            </section>
        </>
    );
}
