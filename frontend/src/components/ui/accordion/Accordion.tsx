"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion as AccordionWrapper } from "@szhsin/react-accordion";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { FaChevronLeft } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { AccordionContainerProps } from "./Accordion.interfaces";

import SearchBarCatalog from "../searchBarCatalog/SearchBarCatalog";
import AccordionItem from "./AccordionItem";
import SortAccordion from "../sortAccordion/SortAccordion";

const schema = z.object({
    value: z
        .string()
        .refine((val) => val === "" || /^-?\d*\.?\d+$/.test(val), {
            message: "Must be a number",
        })
        .transform((val) => (val === "" ? null : Number(val)))
        .refine((val) => val === null || Number.isInteger(val), {
            message: "Must be an integer",
        })
        .refine((val) => val === null || val > 0, {
            message: "Must be a positive number",
        }),
});

export default function Accordion({
    items,
}: Readonly<AccordionContainerProps>) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(699);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setScreenWidth(window.innerWidth);
            };

            setScreenWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [screenWidth]);

    const updateFiltersByCheckbox = (
        checked: boolean,
        option: string,
        setState: Dispatch<SetStateAction<{ [key: string]: string[] }>>,
        header: string,
    ) => {
        const filterKey = header.toLowerCase();

        if (checked) {
            setState((prevState) => ({
                ...prevState,
                [filterKey]: [...new Set(prevState[filterKey]).add(option)],
            }));
        }

        if (!checked) {
            setState((prevState) => {
                const next = new Set(prevState[filterKey]);
                next.delete(option);
                return { ...prevState, [filterKey]: [...next] };
            });
        }
    };

    const updateFiltersByRadio = (
        option: string,
        setState: Dispatch<SetStateAction<{ [key: string]: string[] }>>,
        header: string,
    ) => {
        const filterKey = header.toLowerCase();

        setState((prevState) => ({ ...prevState, [filterKey]: [option] }));
    };

    const updateFiltersByRange = useDebouncedCallback(
        (
            value: string,
            name: string,
            header: string,
            setState: Dispatch<
                SetStateAction<{
                    [key: string]: string[];
                }>
            >,
            content: number[],
        ) => {
            const validatedFields = schema.safeParse({
                value: value,
            });

            if (!validatedFields.success) {
                console.error(validatedFields.error.message);
                throw new Error("Value must contain only numbers");
            }

            const filterKey = header.toLowerCase();

            if (name === `${header}-from`) {
                setState((prevState) => ({
                    ...prevState,
                    [filterKey]: [value, prevState[filterKey][1]],
                }));
            }

            if (name === `${header}-to`) {
                setState((prevState) => ({
                    ...prevState,
                    [filterKey]: [prevState[filterKey][0], value],
                }));
            }

            if (name === `${header}-to` && value === "") {
                setState((prevState) => ({
                    ...prevState,
                    [filterKey]: content.map((item) => String(item)),
                }));
            }
        },
        500,
    );

    const handleOpenModal = () => {
        setTimeout(() => setIsVisible(true), 10);
        setIsMounted(true);
    };

    const handleCloseModal = () => {
        setTimeout(() => setIsMounted(false), 200);
        setIsVisible(false);
    };

    const toggleModal = () => {
        if (isVisible) {
            handleCloseModal();
        }

        if (!isVisible) {
            handleOpenModal();
        }
    };

    return (
        <>
            <button
                className="md:hidden flex justify-between items-center w-full px-5 py-2 border rounded-md"
                onClick={toggleModal}
            >
                Filters <IoFilter />
            </button>
            {(screenWidth > 767 || isMounted) && (
                <div
                    className={`absolute md:relative left-0 top-0 w-full h-full px-5 py-5 md:p-0 bg-white z-40 transition-all duration-200 ease-out ${
                        screenWidth > 767 || isVisible
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90"
                    }`}
                >
                    <div className="container mx-auto">
                        <div className="md:hidden flex items-center gap-3">
                            <FaChevronLeft
                                className="text-xl"
                                onClick={handleCloseModal}
                            />
                            <h2 className="text-2xl">Filters</h2>
                        </div>
                        <div className="w-full mt-5 md:mt-0">
                            <SearchBarCatalog />
                        </div>
                        <AccordionWrapper
                            allowMultiple
                            transition
                            transitionTimeout={250}
                            className="w-auto"
                        >
                            <SortAccordion />
                            {items.map(
                                (
                                    {
                                        header,
                                        content,
                                        type,
                                        setState,
                                        defaultChecked,
                                        rangeText,
                                    },
                                    i,
                                ) =>
                                    content.length ? (
                                        <AccordionItem key={i} header={header}>
                                            {type === "checkbox" &&
                                                content.map(
                                                    (option, i) =>
                                                        typeof option ===
                                                            "string" && (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name={
                                                                        option
                                                                    }
                                                                    id={option}
                                                                    className="w-4 h-4 mt-[2px] text-blue-600 bg-gray-100 border-gray-300"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        updateFiltersByCheckbox(
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                            option,
                                                                            setState as Dispatch<
                                                                                SetStateAction<{
                                                                                    [
                                                                                        key: string
                                                                                    ]: string[];
                                                                                }>
                                                                            >,
                                                                            header,
                                                                        );
                                                                    }}
                                                                    defaultChecked={
                                                                        defaultChecked ===
                                                                        option
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={
                                                                        option
                                                                    }
                                                                    className="text-lg font-medium"
                                                                >
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        ),
                                                )}
                                            {type === "radio" &&
                                                content.map(
                                                    (option, i) =>
                                                        typeof option ===
                                                            "string" && (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={
                                                                        header
                                                                    }
                                                                    id={option}
                                                                    className="w-4 h-4 text-blue-600 border-gray-300"
                                                                    onClick={() =>
                                                                        updateFiltersByRadio(
                                                                            option,
                                                                            setState as Dispatch<
                                                                                SetStateAction<{
                                                                                    [
                                                                                        key: string
                                                                                    ]: string[];
                                                                                }>
                                                                            >,
                                                                            header,
                                                                        )
                                                                    }
                                                                    defaultChecked={
                                                                        defaultChecked ===
                                                                        option
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        ),
                                                )}
                                            {type === "range" && (
                                                <div className="flex items-start gap-3">
                                                    <div className="grid gap-1">
                                                        <input
                                                            type="number"
                                                            name={`${header}-from`}
                                                            placeholder="from"
                                                            className="px-4 py-2 border rounded-lg w-full"
                                                            onChange={(e) =>
                                                                updateFiltersByRange(
                                                                    e.target
                                                                        .value,
                                                                    e.target
                                                                        .name,
                                                                    header,
                                                                    setState as Dispatch<
                                                                        SetStateAction<{
                                                                            [
                                                                                key: string
                                                                            ]: string[];
                                                                        }>
                                                                    >,
                                                                    content as number[],
                                                                )
                                                            }
                                                        />
                                                        <span className="text-gray-400 text-sm">
                                                            {rangeText
                                                                ? rangeText[0]
                                                                : ""}
                                                        </span>
                                                    </div>
                                                    <span className="flex mt-1 text-xl font-bold">
                                                        —
                                                    </span>
                                                    <div className="grid gap-1">
                                                        <input
                                                            type="number"
                                                            name={`${header}-to`}
                                                            placeholder="to"
                                                            className="px-4 py-2 border rounded-lg w-full"
                                                            onChange={(e) =>
                                                                updateFiltersByRange(
                                                                    e.target
                                                                        .value,
                                                                    e.target
                                                                        .name,
                                                                    header,
                                                                    setState as Dispatch<
                                                                        SetStateAction<{
                                                                            [
                                                                                key: string
                                                                            ]: string[];
                                                                        }>
                                                                    >,
                                                                    content as number[],
                                                                )
                                                            }
                                                        />
                                                        <span className="text-gray-400 text-sm">
                                                            {rangeText
                                                                ? rangeText[1]
                                                                : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </AccordionItem>
                                    ) : null,
                            )}
                        </AccordionWrapper>
                    </div>
                </div>
            )}
        </>
    );
}
