import { HeroProps } from "./Hero.interfaces";

import Button from "@/components/ui/main/button/Button";
import AppImage from "@/components/ui/main/appImage/AppImage";

export default function Hero({ data }: Readonly<HeroProps>) {
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
                        href={
                            product.slug
                                ? `/catalog/${product.slug}`
                                : "/catalog"
                        }
                        theme="light"
                        text="Shop now"
                        isLink
                    />
                </div>
                <AppImage
                    src={image.url}
                    alt={image.alternativeText ?? product.name}
                    width={800}
                    height={800}
                    priority
                />
            </div>
        </section>
    );
}
