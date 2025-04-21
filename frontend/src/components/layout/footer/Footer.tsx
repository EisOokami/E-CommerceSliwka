import styles from "./Footer.module.scss";
import { FooterProps } from "./Footer.interfaces";

import Logo from "@/components/ui/logo/Logo";
import UtilityLinks from "@/components/ui/utilityLinks/UtilityLinks";
import SocialMedia from "@/components/ui/socialMedia/SocialMedia";

export default function Footer({ data }: Readonly<FooterProps>) {
    const { logoImage, logoLink, utilityLinks, socialLinks, aboutUs } = data;

    return (
        <footer className="px-3 md:px-5 text-white bg-black">
            <div className="grid gap-10 md:gap-0 container mx-auto py-10 md:py-20">
                <div className="grid md:flex md:justify-between gap-10 md:gap-0">
                    <div className="text-center md:text-left grid content-start justify-items-center md:justify-items-start gap-5 md:w-1/3">
                        <Logo
                            width={50}
                            height={50}
                            src={logoImage.url}
                            alt={logoImage.alternativeText}
                            link={logoLink.url}
                        />
                        <p className="md:text-xl text-gray-300">{aboutUs}</p>
                    </div>
                    <UtilityLinks styles={styles} utilityLinks={utilityLinks} />
                </div>
                <SocialMedia socialLinks={socialLinks} styles={styles} />
            </div>
        </footer>
    );
}
