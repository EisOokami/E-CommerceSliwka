import Link from "next/link";
import AppImage from "@/components/ui/main/appImage/AppImage";
import { AuthShellProps } from "./AuthShell.interfaces";

export default function AuthShell({
    pageData,
    children,
}: Readonly<AuthShellProps>) {
    return (
        <>
            <section className="hidden md:block w-1/2 bg-gray-100">
                <Link
                    href={pageData.link.url}
                    className="block w-full h-full"
                    target={pageData.link.isExternal ? "_blank" : undefined}
                    rel={
                        pageData.link.isExternal
                            ? "noopener noreferrer"
                            : undefined
                    }
                >
                    <AppImage
                        src={pageData.banner.url}
                        alt={
                            pageData.banner.alternativeText ??
                            pageData.link.text
                        }
                        width={1500}
                        height={1500}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </section>
            <section className="grid content-center md:place-items-center min-w-0 w-full md:w-1/2 container mx-auto px-5 py-10">
                <div className="grid w-full gap-6 md:w-5/6 lg:w-2/3 md:p-5">
                    {children}
                </div>
            </section>
        </>
    );
}
