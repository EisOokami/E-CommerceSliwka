import { ProductTitleProps } from "./ProductTitle.interfaces";

export default function ProductTitle({ title }: Readonly<ProductTitleProps>) {
    return (
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
    );
}
