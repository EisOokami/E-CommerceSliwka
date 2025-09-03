"use client";

import { ChangeEvent, useActionState, useEffect, useState } from "react";
import useProductStore from "@/stores/product";
import Image from "next/image";
import {
    addReviewToProductAction,
    updateProductAverageRatingAction,
} from "@/data/actions/productActions";
import { getReviewsData } from "@/data/loaders";
import { MdOutlineImage } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ReviewInputProps } from "./ReviewInput.interfaces";

import WarningMsg from "../warningMsg/WarningMsg";
import Button from "../button/Button";
import Rating from "../rating/Rating";
import { StrapiErrors } from "../strapiErrors/StrapiErrors";
import { ZodErrors } from "../zodErrors/ZodErrors";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
    strapiErrorsDetails: null,
    formData: null,
};

export default function ReviewInput({
    productData,
    user,
}: Readonly<ReviewInputProps>) {
    const setUpdatedReviewsData = useProductStore(
        (state) => state.setUpdatedReviewsData,
    );
    const setUpdatedAverageRating = useProductStore(
        (state) => state.setUpdatedAverageRating,
    );
    const [rating, setRating] = useState<number>(0);
    const [imagesFromUpload, setImagesFromUpload] = useState<File[] | null>(
        null,
    );
    const [formState, formAction, isPending] = useActionState(
        handleSubmitAddReview,
        INITIAL_STATE,
    );

    if (!user.ok) {
        return (
            <WarningMsg message="Please sign in to your account to leave a comment." />
        );
    }

    if (user.error) {
        return (
            <WarningMsg
                message="An error occurred while processing the user. Please try
                    again later."
            />
        );
    }

    const hasProduct = user.data?.orders.some((order) =>
        order.cartItems &&
        order.deliveryStatus === "Delivered" &&
        order.isSuccess
            ? order.cartItems.some(
                  (cartItem) =>
                      cartItem.product.documentId === productData.documentId,
              )
            : false,
    );

    if (!hasProduct) {
        return (
            <WarningMsg message="You must purchase this product to leave a comment." />
        );
    }

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            setImagesFromUpload((prevState) => [
                ...(prevState || []),
                ...filesArray,
            ]);
        }
    };

    const handleDeleteImage = (index: number) => {
        if (!imagesFromUpload) {
            return;
        }

        const updatedImages = imagesFromUpload.filter((_, i) => i !== index);

        setImagesFromUpload(updatedImages);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleSubmitAddReview(prevState: any, formData: FormData) {
        const result = await addReviewToProductAction(
            prevState,
            formData,
            imagesFromUpload,
            rating,
            productData.documentId,
        );

        if (!result.strapiErrors && !result.zodErrors) {
            const updatedReviewsData = await getReviewsData(
                productData.documentId,
            );
            const updatedAverageRating = await updateProductAverageRatingAction(
                productData.documentId,
            );

            setUpdatedReviewsData(updatedReviewsData);
            setUpdatedAverageRating(updatedAverageRating);
        }

        return result;
    }

    return (
        <form
            action={formAction}
            className="grid gap-5"
            style={INITIAL_STATE.data ? { opacity: 0 } : {}}
        >
            <div className="flex items-center gap-2 px-5 md:px-10 py-2.5 md:py-5 border rounded-xl">
                <textarea
                    name="description"
                    rows={1}
                    className="w-full md:text-xl outline-none"
                    defaultValue={
                        formState?.formData
                            ? formState?.formData.get("description")
                            : null
                    }
                />
                <input
                    type="file"
                    name="images"
                    id="images"
                    multiple
                    onChange={onImageChange}
                    className="hidden"
                    accept=".jpg, .jpeg, .png, .webp"
                />
                <label
                    htmlFor="images"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            document.getElementById("images")?.click();
                        }
                    }}
                >
                    <MdOutlineImage className="text-2xl md:text-3xl text-gray-500 cursor-pointer" />
                </label>
            </div>
            <div className="grid md:flex md:justify-between md:items-start gap-3">
                <div className="flex flex-wrap gap-2">
                    {imagesFromUpload &&
                        imagesFromUpload.map((image, i) => (
                            <div key={i} className="relative">
                                <Image
                                    src={URL.createObjectURL(image)}
                                    alt={image.name}
                                    width={200}
                                    height={200}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    className="absolute -top-2 -right-2.5 w-min h-min p-1 text-white bg-red-500 rounded-full z-40"
                                    onClick={() => handleDeleteImage(i)}
                                >
                                    <IoClose className="text-lg" />
                                </button>
                            </div>
                        ))}
                </div>
                <div className="grid md:flex md:justify-end md:items-center gap-3 md:gap-5">
                    <div className="flex items-start gap-2">
                        <p className="w-max md:text-lg">Select rating:</p>
                        <Rating
                            starsClassName="text-2xl"
                            isEdited
                            onRate={setRating}
                        />
                    </div>
                    {isPending ? (
                        <Button
                            text="Loading"
                            theme="dark"
                            type="button"
                            isLoading
                            className="w-full md:min-w-48 text-sm md:text-base"
                        />
                    ) : (
                        <Button
                            text="Send review"
                            theme="dark"
                            type="submit"
                            className="w-full md:min-w-48 text-sm md:text-base"
                        />
                    )}
                </div>
            </div>
            {formState?.strapiErrorsDetails &&
            formState?.strapiErrorsDetails.length ? (
                formState?.strapiErrorsDetails.map(
                    (
                        error: {
                            path: string;
                            message: string;
                            name: string;
                            value: string;
                        },
                        i: number,
                    ) => <StrapiErrors key={i} error={error} />,
                )
            ) : (
                <StrapiErrors error={formState?.strapiErrors} />
            )}
            <div className="grid gap-1 md:min-w-72">
                <ZodErrors error={formState?.zodErrors?.description} />
                <ZodErrors error={formState?.zodErrors?.rating} />
                <ZodErrors error={formState?.zodErrors?.images} />
            </div>
        </form>
    );
}
