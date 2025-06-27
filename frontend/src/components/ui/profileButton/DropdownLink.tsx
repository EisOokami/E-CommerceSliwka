import Link from "next/link";
import { DropdownLinkProps } from "./ProfileButton.interfaces";

export default function DropdownLink({
    href,
    icon,
    label,
    onClick,
}: Readonly<DropdownLinkProps>) {
    return (
        <button className="w-full text-left" onClick={onClick}>
            <Link
                href={href}
                className="flex items-center gap-2 w-full px-5 py-2 text-lg text-gray-700 hover:text-black hover:bg-gray-100 transition"
            >
                {icon}
                {label}
            </Link>
        </button>
    );
}
