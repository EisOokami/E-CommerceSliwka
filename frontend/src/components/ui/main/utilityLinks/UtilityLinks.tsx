import Link from "next/link";
import { UtilityLinksProps } from "./UtilityLinks.interfaces";

export default function UtilityLinks({
    utilityLinks,
    styles,
}: Readonly<UtilityLinksProps>) {
    return (
        <>
            {utilityLinks.map(({ id, links, title }) => (
                <div key={id} className="text-center md:text-left grid gap-2">
                    <h6 className="text-lg md:text-2xl">{title}</h6>
                    <ul className={styles["footer__container-links"]}>
                        {links.map(({ id, text, url, isExternal }) => (
                            <li key={id}>
                                <Link
                                    href={url ?? ""}
                                    {...(isExternal && url.startsWith("http")
                                        ? {
                                              target: "_blank",
                                              rel: "noopener noreferrer",
                                          }
                                        : {})}
                                >
                                    {text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
}
