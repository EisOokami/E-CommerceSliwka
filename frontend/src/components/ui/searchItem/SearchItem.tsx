import Image from "next/image";
import { SearchItemProps } from "./SearchItem.interfaces";
import Link from "next/link";

export default function SearchItem({
    productData,
    setIsOpen,
    setIsOpenMenu,
}: SearchItemProps) {
    const handleClose = () => {
        setIsOpen(false);
        setIsOpenMenu(false);
    };

    return (
        <Link
            href={`/catalog/${productData.slug}`}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
            onClick={handleClose}
        >
            <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <Image
                    src={`${process.env.NEXT_PUBLIC_DB_URL}${productData.image.url}`}
                    alt={productData.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-medium">{productData.name}</h3>
                <p className="text-sm text-gray-500">
                    $
                    {productData.isDiscount && productData.discountedPrice
                        ? productData.discountedPrice
                        : productData.price}
                </p>
            </div>
        </Link>
    );
}
