import { HTMLAttributeReferrerPolicy, ReactEventHandler } from "react";

export interface AppImageProps {
    src: string;
    alt: string;
    height?: number | `${number}`;
    width?: number | `${number}`;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    loading?: "lazy" | "eager";
    decoding?: "async" | "auto" | "sync";
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    onError?: ReactEventHandler<HTMLImageElement> | undefined;
}
