import InlineButton from "@/components/ui/inlineButton/InlineButton";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="pt-16 md:pt-0 bg-[#211C24]">
            <div className="grid md:flex md:justify-between container mx-auto">
                <div className="grid justify-items-center md:justify-items-start md:content-center gap-3">
                    <h1 className="text-center md:text-left text-6xl md:text-7xl lg:text-8xl text-white font-light">
                        IPhone 16 <span className="font-semibold">Pro</span>
                    </h1>
                    <p className="text-center md:text-left text-gray-400">
                        Created to change everything for the better. For
                        everyone
                    </p>
                    <InlineButton theme="light" />
                </div>
                <Image src="/hero.png" alt="iphone" width={800} height={800} />
            </div>
        </section>
    );
}
