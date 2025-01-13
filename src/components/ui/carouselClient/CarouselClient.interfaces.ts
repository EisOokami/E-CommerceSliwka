export interface CarouselClientProps {
    productsData: {
        src: string;
        alt: string;
        name: string;
        descr: string;
        href: string;
    }[];
    options: unknown;
    width: number | `${number}` | undefined;
    height: number | `${number}` | undefined;
}
