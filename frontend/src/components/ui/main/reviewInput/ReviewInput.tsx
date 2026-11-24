"use client";

import { ChangeEvent, useActionState, useEffect, useState } from "react";
import useProductStore from "@/stores/product";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
    addReviewToProductAction,
    updateProductAverageRatingAction,
} from "@/data/main/actions/productActions";
import { getReviewsData, getAllOrdersData } from "@/data/main/loaders";
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
    const [hasProduct, setHasProduct] = useState<boolean | null>(null);
    const [purchaseError, setPurchaseError] = useState("");

    useEffect(() => {
        setUpdatedReviewsData(productData.reviews);
        setUpdatedAverageRating(productData.averageRating);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let active = true;

        if (!user.ok) {
            return;
        }

        getAllOrdersData()
            .then((result) => {
                if (active) {
                    setHasProduct(
                        !!result?.data.some(
                            (order) =>
                                order.isSuccess &&
                                order.deliveryStatus === "Delivered" &&
                                order.cartItems.some(
                                    (item) =>
                                        item.product.id === productData.id,
                                ),
                        ),
                    );
                }
            })
            .catch(() => {
                if (active) {
                    setPurchaseError(
                        "Purchase history could not be loaded. Please reload.",
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [user.ok, productData.id]);

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

    if (purchaseError) {
        return <WarningMsg message={purchaseError} />;
    }

    if (hasProduct === null) {
        return <WarningMsg message="Checking purchase history..." />;
    }

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
            productData.id,
        );

        if (result && !result.strapiErrors && !result.zodErrors) {
            setRating(0);
            setImagesFromUpload(null);

            if (result.message) {
                toast.info(result.message);
            }

            try {
                const [reviews, average] = await Promise.all([
                    getReviewsData(productData.id),
                    updateProductAverageRatingAction(productData.id),
                ]);

                setUpdatedReviewsData(reviews ?? null);
                setUpdatedAverageRating(average);
            } catch {
                toast.error(
                    "Review saved, but the list could not be refreshed. Reload before submitting again.",
                );
            }
        }

        return result;
    }

    return (
        <form action={formAction} className="grid gap-5">
            <p className="text-sm md:text-base text-gray-500 text-pretty">
                Reviews are public: everyone can see your text, rating, photos,
                username and avatar. You can delete your review at any time. Do
                not include other people&apos;s personal data or photos you do
                not have the rights to.{" "}
                <Link href="/privacy" className="underline">
                    Privacy Policy
                </Link>
            </p>
            <div className="flex items-center gap-2 px-5 md:px-10 py-2.5 md:py-5 border rounded-xl">
                <textarea
                    name="description"
                    rows={1}
                    className="w-full md:text-xl outline-none ring-0"
                    defaultValue={
                        formState?.formData?.get("description")?.toString() ??
                        ""
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
                            currentRating={rating}
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
                formState?.strapiErrorsDetails.map((error, i) => (
                    <StrapiErrors key={i} error={error} />
                ))
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
