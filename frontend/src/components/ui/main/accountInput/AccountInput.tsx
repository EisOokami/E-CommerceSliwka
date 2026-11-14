import { twMerge } from "tailwind-merge";
import AuthInput from "../authInput/AuthInput";
import type { AccountInputProps } from "./AccountInput.interfaces";

export default function AccountInput({
    containerClassName,
    ...props
}: Readonly<AccountInputProps>) {
    return (
        <AuthInput
            {...props}
            containerClassName={twMerge(
                "self-start place-self-center max-w-[1000px] w-full",
                containerClassName,
            )}
        />
    );
}
