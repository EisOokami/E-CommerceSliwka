import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import { SocialMediaProps } from "./SocialMedia.interfaces";

function selectSocialMediaIcon(socialMedia: string) {
    switch (socialMedia.toLowerCase()) {
        case "github":
            return <FaGithub />;
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
                    rel="noopener noreferrer"
                >
                    {selectSocialMediaIcon(text.length ? text : id)}
                </Link>
            ))}
        </div>
    );
}
