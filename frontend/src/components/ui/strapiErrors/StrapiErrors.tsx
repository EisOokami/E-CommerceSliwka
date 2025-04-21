import { MdError } from "react-icons/md";
import { StrapiErrorsProps } from "./StrapiErrors.interfaces";

export function StrapiErrors({
    error,
}: Readonly<{ error: StrapiErrorsProps }>) {
    if (!error?.message) return null;
    return (
        <div className="flex items-center gap-1 py-1 text-sm text-red-500">
            <MdError className="text-lg" />
            <p>{error.message}</p>
        </div>
    );
}
