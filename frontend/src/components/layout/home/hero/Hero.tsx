import { HeroProps } from "./Hero.interfaces";

import Button from "@/components/ui/button/Button";
import StrapiImage from "@/components/ui/strapiImage/StrapiImage";

export default async function Hero({ data }: Readonly<{ data: HeroProps }>) {
    const { heading, subHeading, image, product } = data;

    return (
        <section className="pt-16 md:pt-0 px-5 bg-[#211C24]">
            <div className="grid md:flex md:justify-between container mx-auto">
                <div className="grid justify-items-center md:justify-items-start md:content-center gap-3">
                    <h1 className="text-center md:text-left text-6xl md:text-7xl lg:text-8xl text-white font-light">
                        {heading.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="font-semibold">
                            {heading.split(" ").pop()}
                        </span>
                    </h1>
                    <p className="text-center md:text-left text-gray-400">
                        {subHeading}
                    </p>
                    <Button
                        href={`catalog/${product.slug}`}
                        theme="light"
                        text="Shop now"
                        isLink
                    />
                </div>
                <StrapiImage
                    src={image.url}
                    alt={image.alternativeText ?? "iphone"}
                    width={800}
                    height={800}
                />
            </div>
        </section>
    );
}
