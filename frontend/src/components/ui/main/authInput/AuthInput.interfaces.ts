import type { InputHTMLAttributes } from "react";

export interface AuthInputProps extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    | "autoComplete"
    | "inputMode"
    | "maxLength"
    | "required"
    | "disabled"
    | "pattern"
> {
    defaultValue?: string | number;
    zodErrorMsg: string[] | undefined;
    id: string;
    name: string;
    type?: string;
    labelValue: string;
    containerClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
}
