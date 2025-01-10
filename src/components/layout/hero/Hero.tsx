import Button from "@/components/ui/button/Button";
import Image from "next/image";

export default function Hero() {
    return (
        <section>
            <div className="pt-16 md:pt-0 bg-[#211C24]">
                <div className="grid md:flex md:justify-between container mx-auto">
                    <div className="grid justify-items-center md:justify-items-start md:content-center gap-3">
                        <h1 className="text-center md:text-left text-6xl md:text-7xl lg:text-8xl text-white font-light">
                            IPhone 16 <span className="font-semibold">Pro</span>
                        </h1>
                        <p className="text-center md:text-left text-gray-400">
                            Created to change everything for the better. For
                            everyone
                        </p>
                        <Button theme="light" text="Shop now" />
                    </div>
                    <Image
                        src="/iphone-hero.png"
                        alt="iphone"
                        width={800}
                        height={800}
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-[25%_25%_50%] md:grid-rows-3 xl:grid-rows-2">
                <div className="md:col-span-2 md:row-span-1 grid md:flex justify-items-center md:justify-items-start md:items-center md:gap-5 p-5 md:pl-0">
                    <Image
                        src="/ps5-hero.png"
                        alt="ps5"
                        width={250}
                        height={200}
                        className="md:object-scale-down xl:object-cover md:object-right md:w-40 md:h-full"
                    />
                    <div className="text-center md:text-left grid gap-5">
                        <h3 className="text-4xl md:text-3xl xl:text-6xl font-medium">
                            Playstation 5
                        </h3>
                        <p className="text-gray-700">
                            Incredibly powerful CPUs, GPUs, and ап SSD with
                            integrated I/O will redefine your PlayStation
                            experience.
                        </p>
                    </div>
                </div>
                <div className="md:col-span-1 md:row-span-3 xl:row-span-2 relative grid md:flex justify-items-center md:justify-items-start md:justify-between md:items-center order-last md:order-none p-5 md:p-0 md:pl-16 bg-[#EDEDED] overflow-hidden">
                    <div className="text-center md:text-left grid justify-items-center md:justify-items-start gap-5">
                        <h3 className="text-4xl md:text-5xl lg:text-7xl font-light">
                            Macbook <span className="font-semibold">Air</span>
                        </h3>
                        <p className="text-gray-700">
                            The new 15-inch Macbook Air makes room for more of
                            what уоu love with а spacious Liquid Retina display.
                        </p>
                        <Button theme="dark" text="Shop now" />
                    </div>
                    <Image
                        src="/macbook-air-hero.png"
                        alt="macbook-air"
                        width={800}
                        height={800}
                        className="md:object-cover md:object-left order-first md:order-none w-96 md:w-auto h-full"
                    />
                </div>
                <div className="md:col-span-2 xl:col-span-1 md:row-span-1 grid md:flex justify-items-center md:items-center md:gap-4 p-5 md:p-0 md:pr-5 xl:pr-10 bg-[#EDEDED]">
                    <Image
                        src="/airpods-max-hero.png"
                        alt="airpods-max"
                        width={250}
                        height={300}
                        className="md:object-none md:object-right md:w-48 md:h-full"
                    />
                    <div className="text-center md:text-left grid gap-5">
                        <h4 className="text-4xl md:text-2xl lg:text-3xl">
                            Apple AirPods{" "}
                            <span className="font-semibold">Max</span>
                        </h4>
                        <p className="text-gray-700">
                            Computational audio, Listen, it&apos;s powerful
                        </p>
                    </div>
                </div>
                <div className="md:col-span-2 xl:col-span-1 md:row-span-1 grid md:flex justify-items-center md:items-center md:gap-4 p-5 md:p-0 md:pr-5 xl:pr-10 bg-[#353535]">
                    <Image
                        src="/vision-pro-hero.png"
                        alt="vision-pro"
                        width={300}
                        height={300}
                        className="md:object-none md:object-right md:w-48 xl:w-36 md:h-full xl:h-52"
                    />
                    <div className="text-center md:text-left grid gap-5">
                        <h4 className="text-4xl md:text-2xl lg:text-3xl text-white">
                            Apple Vision{" "}
                            <span className="font-semibold">Pro</span>
                        </h4>
                        <p className="text-gray-400">
                            An immersive way to experience entertainment
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
