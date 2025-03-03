import StrapiImage from "@/components/ui/strapiImage/StrapiImage";
import Button from "@/components/ui/button/Button";
import { FeatureProductsProps } from "./FeatureProducts.interfaces";

export default function FeatureProducts({
    data,
}: Readonly<{
    data: FeatureProductsProps;
}>) {
    const { featureproduct } = data;

    return (
        <section className="grid md:grid-cols-[25%_25%_50%] md:grid-rows-3 xl:grid-rows-2">
            <div className="md:col-span-2 md:row-span-1 grid md:flex justify-items-center md:justify-items-start md:items-center md:gap-5 p-5 md:pl-0">
                <StrapiImage
                    src={featureproduct[0].image.url}
                    alt={
                        featureproduct[0].image.alternativeText ??
                        featureproduct[0].heading
                    }
                    width={250}
                    height={200}
                    className="md:object-scale-down xl:object-cover md:object-right md:w-40 md:h-full"
                />
                <div className="text-center md:text-left grid gap-5">
                    <h3 className="text-4xl md:text-3xl xl:text-6xl font-medium">
                        {featureproduct[0].heading}
                    </h3>
                    <p className="text-gray-700">
                        {featureproduct[0].subHeading}
                    </p>
                </div>
            </div>
            <div className="md:col-span-1 md:row-span-3 xl:row-span-2 relative grid md:flex justify-items-center md:justify-items-start md:justify-between md:items-center order-last md:order-none p-5 md:p-0 md:pl-16 bg-[#EDEDED] overflow-hidden">
                <div className="text-center md:text-left grid justify-items-center md:justify-items-start gap-5">
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-light">
                        {featureproduct[1].heading
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}{" "}
                        <span className="font-semibold">
                            {featureproduct[1].heading.split(" ").pop()}
                        </span>
                    </h3>
                    <p className="text-gray-700">
                        {featureproduct[1].subHeading}
                    </p>
                    <Button
                        href={featureproduct[1].link.url}
                        theme="dark"
                        text={featureproduct[1].link.text}
                        inline
                        isLink
                    />
                </div>
                <StrapiImage
                    src={featureproduct[1].image.url}
                    alt={
                        featureproduct[1].image.alternativeText ??
                        featureproduct[1].heading
                    }
                    width={800}
                    height={800}
                    className="md:object-cover md:object-left order-first md:order-none w-96 md:w-auto h-full"
                />
            </div>
            <div className="md:col-span-2 xl:col-span-1 md:row-span-1 grid md:flex justify-items-center md:items-center md:gap-4 p-5 md:p-0 md:pr-5 xl:pr-10 bg-[#EDEDED]">
                <StrapiImage
                    src={featureproduct[2].image.url}
                    alt={
                        featureproduct[2].image.alternativeText ??
                        featureproduct[2].heading
                    }
                    width={250}
                    height={300}
                    className="md:object-none md:object-right md:w-48 md:h-full"
                />
                <div className="text-center md:text-left grid gap-5">
                    <h4 className="text-4xl md:text-2xl lg:text-3xl">
                        {featureproduct[2].heading
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}{" "}
                        <span className="font-semibold">
                            {featureproduct[2].heading.split(" ").pop()}
                        </span>
                    </h4>
                    <p className="text-gray-700">
                        {featureproduct[2].subHeading}
                    </p>
                </div>
            </div>
            <div className="md:col-span-2 xl:col-span-1 md:row-span-1 grid md:flex justify-items-center md:items-center md:gap-4 p-5 md:p-0 md:pr-5 xl:pr-10 bg-[#353535]">
                <StrapiImage
                    src={featureproduct[3].image.url}
                    alt={
                        featureproduct[3].image.alternativeText ??
                        featureproduct[3].heading
                    }
                    width={300}
                    height={300}
                    className="md:object-none md:object-right md:w-48 xl:w-36 md:h-full xl:h-52"
                />
                <div className="text-center md:text-left grid gap-5">
                    <h4 className="text-4xl md:text-2xl lg:text-3xl text-white">
                        {featureproduct[3].heading
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}{" "}
                        <span className="font-semibold">
                            {featureproduct[3].heading.split(" ").pop()}
                        </span>
                    </h4>
                    <p className="text-gray-400">
                        {featureproduct[3].subHeading}
                    </p>
                </div>
            </div>
        </section>
    );
}
