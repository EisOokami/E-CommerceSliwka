import Link from "next/link";
import {
    IoCartOutline,
    IoPersonOutline,
    IoHeartOutline,
} from "react-icons/io5";

export default function HeaderIcons() {
    return (
        <div className="flex justify-around md:justify-normal items-center gap-5 text-2xl">
            <Link href="/">
                <IoHeartOutline />
            </Link>
            <Link href="/cart">
                <IoCartOutline />
            </Link>
            <Link href="/">
                <IoPersonOutline />
            </Link>
        </div>
    );
}
