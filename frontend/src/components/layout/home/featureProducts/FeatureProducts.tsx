import Link from "next/link";
import { FeatureProductsProps } from "./FeatureProducts.interfaces";

import StrapiImage from "@/components/ui/strapiImage/StrapiImage";
import Button from "@/components/ui/button/Button";

export default function FeatureProducts({
    data,
}: Readonly<{
    data: FeatureProductsProps;
}>) {
    const { featureProduct } = data;

    return (
        <section className="grid md:grid-cols-[25%_25%_50%] md:grid-rows-3 xl:grid-rows-2">
            <Link
                href={`catalog/${
                    featureProduct[0].product
                        ? featureProduct[0].product.documentId
                        : ""
                }`}
                className="md:col-span-2 md:row-span-1 grid md:flex justify-items-center md:justify-items-start md:items-center md:gap-5 p-5 md:pl-0"
            >
                <StrapiImage
                    src={featureProduct[0].image.url}
                    alt={
                        featureProduct[0].image.alternativeText ??
                        featureProduct[0].heading
                    }
                    width={250}
                    height={200}
                    className="md:object-scale-down xl:object-cover md:object-right md:w-40 md:h-full"
                />
                <div className="text-center md:text-left grid gap-5">
                    <h3 className="text-4xl md:text-3xl xl:text-6xl font-medium">
                        {featureProduct[0].heading}
                    </h3>
                    <p className="text-gray-700">
                        {featureProduct[0].subHeading}
                    </p>
                </div>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[1].product
                        ? featureProduct[1].product.documentId
                        : ""
                }`}
                className="md:col-span-1 md:row-span-3 xl:row-span-2 relative grid md:flex justify-items-center md:justify-items-start md:justify-between md:items-center order-last md:order-none p-5 md:p-0 md:pl-16 bg-[#EDEDED] overflow-hidden"
            >
                <div className="text-center md:text-left grid justify-items-center md:justify-items-start gap-5">
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-light">
                        {featureProduct[1].heading
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}{" "}
                        <span className="font-semibold">
                            {featureProduct[1].heading.split(" ").pop()}
                        </span>
                    </h3>
                    <p className="text-gray-700">
                        {featureProduct[1].subHeading}
                    </p>
                    <Button
                        // href={featureProduct[1].product.documentId}
                        theme="dark"
                        text="Shop now"
                        inline
                        // isLink
                    />
                </div>
                <StrapiImage
                    src={featureProduct[1].image.url}
                    alt={
                        featureProduct[1].image.alternativeText ??
                        featureProduct[1].heading
                    }
                    width={800}
                    height={800}
                    className="md:object-cover md:object-left order-first md:order-none w-96 md:w-auto h-full"
                />
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[2].product
                        ? featureProduct[2].product.documentId
                        : ""
                }`}
                className="md:col-span-2 xl:col-span-1 md:row-span-1 grid md:flex justify-items-center md:items-center md:gap-4 p-5 md:p-0 md:pr-5 xl:pr-10 bg-[#EDEDED]"
            >
                <StrapiImage
                    src={featureProduct[2].image.url}
                    alt={
                        featureProduct[2].image.alternativeText ??
                        featureProduct[2].heading
                    }
                    width={250}
                    height={300}
                    className="md:object-none md:object-right md:w-48 md:h-full"
                />
                <div className="text-center md:text-left grid gap-5">
                    <h4 className="text-4xl md:text-2xl lg:text-3xl">
                        {featureProduct[2].heading
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}{" "}
                        <span className="font-semibold">
                            {featureProduct[2].heading.split(" ").pop()}
                        </span>
                    </h4>
                    <p className="text-gray-700">
                        {featureProduct[2].subHeading}
                    </p>
                </div>
            </Link>
            <Link
                href={`catalog/${
                    featureProduct[3].product
                        ? featureProduct[3].product.documentId
                        : ""
                }`}
                className="md:col-span-2 xl:col-span-1 md:row-span-1 grid md:flex justify-items-center md:items-center md:gap-4 p-5 md:p-0 md:pr-5 xl:pr-10 bg-[#353535]"
            >
                <StrapiImage
                    src={featureProduct[3].image.url}
                    alt={
                        featureProduct[3].image.alternativeText ??
                        featureProduct[3].heading
                    }
                    width={300}
                    height={300}
                    className="md:object-none md:object-right md:w-48 xl:w-36 md:h-full xl:h-52"
                />
                <div className="text-center md:text-left grid gap-5">
                    <h4 className="text-4xl md:text-2xl lg:text-3xl text-white">
                        {featureProduct[3].heading
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}{" "}
                        <span className="font-semibold">
                            {featureProduct[3].heading.split(" ").pop()}
                        </span>
                    </h4>
                    <p className="text-gray-400">
                        {featureProduct[3].subHeading}
                    </p>
                </div>
            </Link>
        </section>
    );
}
