"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { AccountInputProps } from "./AccountInput.interfaces";

import { ZodErrors } from "../zodErrors/ZodErrors";

export default function AccountInput({
    defaultValue = "",
    zodErrorMsg,
    id,
    name,
    type = "text",
    labelValue,
    containerClassName = "",
    inputClassName = "",
    labelClassName = "",
}: Readonly<AccountInputProps>) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div
            className={twMerge(
                `self-start relative place-self-center max-w-[1000px] w-full ${containerClassName}`,
            )}
        >
            <input
                className={twMerge(
                    `max-w-[1000px] w-full px-4 pt-5 pb-4 pr-11 text-gray-700 border rounded-lg appearance-none leading-tight focus:outline-none peer ${inputClassName}`,
                )}
                id={id}
                name={name}
                type={type === "password" && showPassword ? "text" : type}
                defaultValue={defaultValue || ""}
                placeholder=" "
            />
            {type === "password" && (
                <button
                    type="button"
                    className="absolute top-0 right-4 flex justify-center items-center h-full text-2xl"
                    onClick={handleShowPassword}
                >
                    {showPassword ? <LuEyeClosed /> : <LuEye />}
                </button>
            )}
            <label
                className={twMerge(
                    `absolute left-4 pt-1 text-sm text-gray-700 font-bold transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:left-4 peer-focus:text-sm peer-focus:text-gray-700 ${labelClassName}`,
                )}
                htmlFor={id}
            >
                {labelValue}
            </label>
            <ZodErrors error={zodErrorMsg} />
        </div>
    );
}
