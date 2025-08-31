import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/utils";
import { LuArrowUpRight } from "react-icons/lu";
import { FeatureProductsProps } from "./FeatureProducts.interfaces";

export default function FeatureProducts({
    data,
}: Readonly<{
    data: FeatureProductsProps;
}>) {
    const { featureProduct } = data;

    return (
        <section className="grid grid-cols-12 grid-rows-[repeat(10,_minmax(0,_100px))] sm:grid-rows-12 gap-3 md:gap-8 container sm:h-screen mx-auto px-5 py-10 md:py-20">
            <Link
                href={`catalog/${
                    featureProduct[0].product
                        ? featureProduct[0].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-7 lg:col-span-5 row-span-2 sm:row-span-4 lg:row-span-7 grid content-end p-8 rounded-lg overflow-hidden hover:scale-105 transition"
            >
                <Image
                    src={`${getStrapiMedia(featureProduct[0].image.url)}`}
                    alt={featureProduct[0].subHeading}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl text-white" />
                <h1 className="relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white">
                    {featureProduct[0].subHeading}
                </h1>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[1].product
                        ? featureProduct[1].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-5 lg:col-span-3 row-span-2 sm:row-span-4 lg:row-span-7 grid content-end p-5 rounded-lg overflow-hidden bg-gray-200 hover:scale-105 transition"
            >
                <Image
                    src={`${getStrapiMedia(featureProduct[1].image.url)}`}
                    alt={featureProduct[1].heading}
                    fill
                    className="object-contain"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/10 to-transparent" />
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl" />
                <h2 className="relative z-10 text-lg md:text-2xl lg:text-3xl font-medium">
                    {featureProduct[1].heading}
                </h2>
                <h3 className="relative z-10 text-lg md:text-xl lg:text-2xl">
                    {featureProduct[1].subHeading}
                </h3>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[2].product
                        ? featureProduct[2].product.slug
                        : ""
                }`}
                className="relative col-span-12 lg:col-span-4 row-span-2 sm:row-span-4 lg:row-span-12 grid content-end p-5 rounded-lg overflow-hidden hover:scale-105 transition"
            >
                <Image
                    src={`${getStrapiMedia(featureProduct[2].image.url)}`}
                    alt={featureProduct[2].heading}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl text-white" />
                <h2 className="relative z-10 text-xl md:text-2xl lg:text-3xl text-white font-medium">
                    {featureProduct[2].heading}
                </h2>
                <h3 className="relative z-10 text-xs sm:text-base md:text-lg lg:text-xl text-white">
                    {featureProduct[2].subHeading}
                </h3>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[3].product
                        ? featureProduct[3].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-5 lg:col-span-3 row-span-2 sm:row-span-4 lg:row-span-5 grid content-end p-5 rounded-lg overflow-hidden bg-gray-200 hover:scale-105 transition"
            >
                <Image
                    src={`${getStrapiMedia(featureProduct[3].image.url)}`}
                    alt={featureProduct[3].heading}
                    fill
                    className="object-contain"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-white/10 to-transparent" />
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl" />
                <h2 className="relative z-10 text-xl md:text-2xl font-medium">
                    {featureProduct[3].heading}
                </h2>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[4].product
                        ? featureProduct[4].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-7 lg:col-span-5 row-span-2 sm:row-span-4 lg:row-span-5 grid content-between p-5 rounded-lg overflow-hidden hover:scale-105 transition"
            >
                <Image
                    src={`${getStrapiMedia(featureProduct[4].image.url)}`}
                    alt={featureProduct[4].heading}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50" />
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl text-white" />
                <h3 className="relative z-10 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-2xl">
                    {featureProduct[4].subHeading}
                </h3>
                <h2 className="relative z-10 text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white">
                    {featureProduct[4].heading}
                </h2>
            </Link>
        </section>
    );
}
