"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { addReviewToProductAction } from "@/data/actions/productActions";
import { MdOutlineImage } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ReviewInputProps } from "./ReviewInput.interfaces";

import WarningMsg from "../warningMsg/WarningMsg";
import Button from "../button/Button";
import Rating from "../rating/Rating";
import { StrapiErrors } from "../strapiErrors/StrapiErrors";
import { ZodErrors } from "../zodErrors/ZodErrors";

const INITIAL_STATE = {
    data: null,
};

export default function ReviewInput({ strapiData, user }: ReviewInputProps) {
    const [rating, setRating] = useState<number>();
    const [imagesFromUpload, setImagesFromUpload] = useState<File[] | null>(
        null,
    );
    const [formState, formAction] = useActionState(
        handleSubmitAddReview,
        INITIAL_STATE,
    );

    if (!user.ok) {
        return (
            <WarningMsg message="Please log in to your account to leave a comment." />
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

    const hasProduct = user.data?.productsCart.some((productCart) =>
        productCart.product
            ? productCart.product.documentId === strapiData.documentId
            : false,
    );

    if (!hasProduct) {
        return (
            <WarningMsg message="You must purchase this product to leave a comment." />
        );
    }

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        return await addReviewToProductAction(
            prevState,
            formData,
            imagesFromUpload,
        );
    }

    return (
        <form
            action={formAction}
            className="grid gap-5"
            style={INITIAL_STATE.data ? { opacity: 0 } : {}}
        >
            <div className="flex gap-2 px-10 py-5 border rounded-xl">
                <textarea
                    name="description"
                    rows={1}
                    className="w-full text-xl outline-none"
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
                <label htmlFor="images">
                    <MdOutlineImage className="text-3xl text-gray-500 cursor-pointer" />
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
                        <input
                            type="hidden"
                            name="rating"
                            value={rating ?? ""}
                        />
                        <Rating size="large" isEdited onRate={setRating} />
                    </div>
                    <input
                        type="hidden"
                        name="documentId"
                        value={strapiData.documentId}
                    />
                    <Button
                        text="Send review"
                        theme="dark"
                        type="submit"
                        className="w-full md:min-w-48 text-sm md:text-base"
                    />
                </div>
            </div>
            <StrapiErrors error={formState?.strapiErrors} />
            <div className="grid gap-1 min-w-72">
                <ZodErrors error={formState?.zodErrors?.description} />
                <ZodErrors error={formState?.zodErrors?.rating} />
                <ZodErrors error={formState?.zodErrors?.images} />
            </div>
        </form>
    );
}
