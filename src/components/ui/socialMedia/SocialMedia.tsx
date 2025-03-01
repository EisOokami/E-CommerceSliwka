import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import { SocialMediaProps } from "./SocialMedia.interfaces";
import Link from "next/link";

function selectSocialMediaIcon(url: string) {
    switch (url) {
        case "x":
            return <FaXTwitter />;
        case "bluesky":
            return <FaBluesky />;
        case "facebook":
            return <FaFacebook />;
        case "tiktok":
            return <FaTiktok />;
        case "instagram":
            return <FaInstagram />;
        default:
            return null;
    }
}

export default function SocialMedia({
    socialLinks,
    styles,
}: Readonly<SocialMediaProps>) {
    return (
        <div className="flex justify-center md:justify-normal gap-5">
            {socialLinks.map(({ id, text, url }) => (
                <Link
                    key={id}
                    href={url ?? ""}
                    className={styles.footer__icons}
                    target="_blank"
                >
                    {selectSocialMediaIcon(text)}
                </Link>
            ))}
        </div>
    );
}
