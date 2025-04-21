export interface StrapiImageProps {
    src: string;
    alt: string;
    height: number | `${number}`;
    width: number | `${number}`;
    className?: string;
    priority?: boolean;
}
