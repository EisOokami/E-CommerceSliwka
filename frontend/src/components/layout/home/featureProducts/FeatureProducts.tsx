import Link from "next/link";
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
                className="relative col-span-12 sm:col-span-7 lg:col-span-5 row-span-2 sm:row-span-4 lg:row-span-7 grid content-end p-8 bg-no-repeat bg-cover bg-center rounded-lg shadow-[inset_0px_-150px_50px_0px_rgba(0,_0,_0,_0.45)] hover:scale-105 transition"
                style={{
                    backgroundImage: `url(${getStrapiMedia(
                        featureProduct[0].image.url,
                    )})`,
                }}
            >
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl text-white" />
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white">
                    {featureProduct[0].subHeading}
                </h1>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[1].product
                        ? featureProduct[1].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-5 lg:col-span-3 row-span-2 sm:row-span-4 lg:row-span-7 grid content-end p-5 bg-no-repeat bg-contain bg-center bg-gray-200 rounded-lg shadow-[inset_0px_-150px_50px_0px_rgba(255,_255,_255,_0.45)] hover:scale-105 transition"
                style={{
                    backgroundImage: `url(${
                        process.env.NEXT_PUBLIC_DB_URL +
                        featureProduct[1].image.url
                    })`,
                }}
            >
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl" />
                <h2 className="text-lg md:text-2xl lg:text-3xl font-medium">
                    {featureProduct[1].heading}
                </h2>
                <h3 className="text-lg md:text-xl lg:text-2xl">
                    {featureProduct[1].subHeading}
                </h3>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[2].product
                        ? featureProduct[2].product.slug
                        : ""
                }`}
                className="relative col-span-12 lg:col-span-4 row-span-2 sm:row-span-4 lg:row-span-12 grid content-end p-5 bg-no-repeat bg-cover bg-center rounded-lg shadow-[inset_0px_-200px_50px_0px_rgba(0,_0,_0,_0.45)] hover:scale-105 transition"
                style={{
                    backgroundImage: `url(${
                        process.env.NEXT_PUBLIC_DB_URL +
                        featureProduct[2].image.url
                    })`,
                }}
            >
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl text-white" />
                <h2 className="text-xl md:text-2xl lg:text-3xl text-white font-medium">
                    {featureProduct[2].heading}
                </h2>
                <h3 className="text-xs sm:text-base md:text-lg lg:text-xl text-white">
                    {featureProduct[2].subHeading}
                </h3>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[3].product
                        ? featureProduct[3].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-5 lg:col-span-3 row-span-2 sm:row-span-4 lg:row-span-5 grid content-end p-5 bg-no-repeat bg-contain bg-center bg-gray-200 rounded-lg shadow-[inset_0px_-75px_50px_0px_rgba(255,_255,_255,_0.45)] hover:scale-105 transition"
                style={{
                    backgroundImage: `url(${
                        process.env.NEXT_PUBLIC_DB_URL +
                        featureProduct[3].image.url
                    })`,
                }}
            >
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl" />
                <h2 className="text-xl md:text-2xl font-medium">
                    {featureProduct[3].heading}
                </h2>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[4].product
                        ? featureProduct[4].product.slug
                        : ""
                }`}
                className="relative col-span-12 sm:col-span-7 lg:col-span-5 row-span-2 sm:row-span-4 lg:row-span-5 grid content-between p-5 bg-no-repeat bg-cover bg-center rounded-lg shadow-[inset_0px_75px_50px_-35px_rgba(0,_0,_0,_0.45)] hover:scale-105 transition"
                style={{
                    backgroundImage: `url(${
                        process.env.NEXT_PUBLIC_DB_URL +
                        featureProduct[4].image.url
                    })`,
                }}
            >
                <LuArrowUpRight className="absolute top-2 right-2 text-3xl md:text-4xl lg:text-5xl text-white" />
                <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-2xl">
                    {featureProduct[4].subHeading}
                </h3>
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white">
                    {featureProduct[4].heading}
                </h2>
            </Link>
        </section>
    );
}
