import { memo } from "react";
import Link from "next/link";
import { DropdownLinkProps } from "./ProfileButton.interfaces";

const DropdownLink = memo(function DropdownLink({
    href,
    icon,
    label,
    onClick,
}: Readonly<DropdownLinkProps>) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 w-full px-5 py-2 text-lg text-gray-700 hover:text-black hover:bg-gray-100 transition"
            onClick={onClick}
        >
            {icon}
            {label}
        </Link>
    );
});

export default DropdownLink;
