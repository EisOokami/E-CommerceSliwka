"use client";

import { useActionState, useState } from "react";
import useProductStore from "@/stores/product";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
    deleteReviewAction,
    editReviewAction,
    updateProductAverageRatingAction,
} from "@/data/actions/productActions";
import { getReviewsData } from "@/data/loaders";
import { getStrapiMedia } from "@/lib/utils";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuPencilLine } from "react-icons/lu";
import { MdDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { ReviewCommentProps } from "./ReviewComment.interfaces";
import { IImage } from "@/interfaces/interfaces";

import RatingStars from "../ratingStars/RatingStars";
import Rating from "../rating/Rating";
import { ZodErrors } from "../zodErrors/ZodErrors";
import { StrapiErrors } from "../strapiErrors/StrapiErrors";
import StrapiImage from "../strapiImage/StrapiImage";

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
    strapiErrorsDetails: null,
    formData: null,
};

export default function ReviewComment({
    productDocumentId,
    review,
    user,
}: Readonly<ReviewCommentProps>) {
    const setUpdatedReviewsData = useProductStore(
        (state) => state.setUpdatedReviewsData,
    );
    const setUpdatedAverageRating = useProductStore(
        (state) => state.setUpdatedAverageRating,
    );
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formState, formAction] = useActionState(
        handleSubmitEditReview,
        INITIAL_STATE,
    );
    const [rating, setRating] = useState<number>(review.rating);
    const [imagesFromReview, setImagesFromReview] = useState<IImage[] | null>(
        review.images,
    );
    const [imagesFromUpload, setImagesFromUpload] = useState<File[] | null>([]);

    const handleEditReview = () => {
        setShowForm(!showForm);
    };

    const handleDeleteReview = async () => {
        const deletedReviewDocumentId = await deleteReviewAction(
            review.documentId,
        );

        if (
            deletedReviewDocumentId &&
            typeof deletedReviewDocumentId.data === "string"
        ) {
            const updatedReviewsData = await getReviewsData(productDocumentId);
            const updatedAverageRating = await updateProductAverageRatingAction(
                productDocumentId,
            );

            setUpdatedReviewsData(updatedReviewsData);
            setUpdatedAverageRating(updatedAverageRating);
        }
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            setImagesFromUpload((prevState) => [
                ...(prevState || []),
                ...filesArray,
            ]);
        }
    };

    const handleDeleteImage = (
        index: number,
        type: "fromReview" | "fromUpload",
    ) => {
        if (imagesFromUpload && type === "fromUpload") {
            const updatedImages = imagesFromUpload.filter(
                (_, i) => i !== index,
            );

            setImagesFromUpload(updatedImages);
        }

        if (imagesFromReview && type === "fromReview") {
            const updatedImages = imagesFromReview.filter(
                (_, i) => i !== index,
            );

            setImagesFromReview(updatedImages);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleSubmitEditReview(prevState: any, formData: FormData) {
        const result = await editReviewAction(
            prevState,
            formData,
            imagesFromReview,
            imagesFromUpload,
            review.documentId,
            review.publicationDate,
            review.product.documentId,
            rating,
        );

        if (!result.strapiErrors && !result.zodErrors) {
            const updatedReviewsData = await getReviewsData(
                review.product.documentId,
            );
            const updatedAverageRating = await updateProductAverageRatingAction(
                productDocumentId,
            );

            setUpdatedReviewsData(updatedReviewsData);
            setUpdatedAverageRating(updatedAverageRating);
        }

        return result;
    }

    return (
        <article className="flex items-start gap-3 md:gap-5 p-3 md:p-5 bg-gray-100 rounded-xl">
            <div className="w-14 h-14">
                <Image
                    src={
                        review.user.avatar
                            ? `${getStrapiMedia(review.user.avatar.url)}`
                            : "/avatar.png"
                    }
                    width={70}
                    height={70}
                    alt={review.user.username}
                    className="aspect-square rounded-full object-cover"
                />
            </div>
            {showForm ? (
                <form action={formAction} className="grid gap-1 w-full">
                    <div className="flex justify-between items-start">
                        <div className="grid gap-1">
                            <h6 className="text-lg md:text-xl font-medium">
                                {review.user.username}
                            </h6>
                            <Rating
                                initialRating={review.rating}
                                onRate={setRating}
                                isEdited
                                starsClassName="text-xl md:text-2xl"
                            />
                            <span className="inline md:hidden text-gray-500">
                                {review.publicationDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden md:inline text-gray-500">
                                {review.publicationDate}
                            </span>
                            {user.ok &&
                                user.data?.documentId ===
                                    review.user.documentId && (
                                    <>
                                        <button type="submit">
                                            <MdDone className="text-xl hover:text-green-500 transition cursor-pointer" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleEditReview}
                                        >
                                            <IoClose className="text-xl hover:text-red-500 transition cursor-pointer" />
                                        </button>
                                    </>
                                )}
                        </div>
                    </div>
                    <textarea
                        name="description"
                        id="description"
                        defaultValue={
                            formState?.formData
                                ? formState?.formData.get("description")
                                : review.description
                        }
                        className="text-gray-600 bg-gray-100"
                    ></textarea>
                    <div className="flex flex-wrap gap-3">
                        {imagesFromReview &&
                            imagesFromReview.map((image, i) => (
                                <div key={image.id} className="relative">
                                    <StrapiImage
                                        src={image.url}
                                        alt={
                                            image.alternativeText ??
                                            review.user.username
                                        }
                                        width={300}
                                        height={300}
                                        className="w-20 md:w-32 h-16 md:h-24 rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        className="absolute -top-2 -right-2.5 w-min h-min p-1 text-white bg-red-500 rounded-full z-50"
                                        onClick={() =>
                                            handleDeleteImage(i, "fromReview")
                                        }
                                    >
                                        <IoClose className="text-lg" />
                                    </button>
                                </div>
                            ))}
                        {imagesFromUpload &&
                            imagesFromUpload.map((image, i) => (
                                <div key={i} className="relative">
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        alt={image.name}
                                        width={300}
                                        height={300}
                                        className="w-20 md:w-32 h-16 md:h-24 rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        className="absolute -top-2 -right-2.5 w-min h-min p-1 text-white bg-red-500 rounded-full z-50"
                                        onClick={() =>
                                            handleDeleteImage(i, "fromUpload")
                                        }
                                    >
                                        <IoClose className="text-lg" />
                                    </button>
                                </div>
                            ))}
                        <div
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    document
                                        .getElementById("upload-images")
                                        ?.click();
                                }
                            }}
                        >
                            <label
                                htmlFor="upload-images"
                                className="grid place-content-center w-20 md:w-32 h-16 md:h-24 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer"
                            >
                                <FiPlusCircle className="text-3xl text-gray-600" />
                            </label>
                            <input
                                type="file"
                                name="upload-images"
                                id="upload-images"
                                className="hidden"
                                multiple
                                onChange={onImageChange}
                                accept=".jpg, .jpeg, .png, .webp"
                            />
                        </div>
                    </div>
                    <ZodErrors error={formState?.zodErrors?.description} />
                    <ZodErrors error={formState?.zodErrors?.rating} />
                    <ZodErrors error={formState?.zodErrors?.images} />
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
                </form>
            ) : (
                <div className="grid gap-1 w-full">
                    <div className="flex justify-between items-start">
                        <div className="grid gap-1">
                            <h6 className="text-lg md:text-xl font-medium">
                                {review.user.username}
                            </h6>
                            <RatingStars
                                count={review.rating}
                                starsClassName="text-xl md:text-2xl"
                            />
                            <span className="inline md:hidden text-gray-500">
                                {review.publicationDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden md:inline text-gray-500">
                                {review.publicationDate}
                            </span>
                            {user.ok &&
                                user.data?.documentId ===
                                    review.user.documentId && (
                                    <>
                                        <button onClick={handleEditReview}>
                                            <LuPencilLine className="text-xl hover:text-blue-500 transition cursor-pointer" />
                                        </button>
                                        <button onClick={handleDeleteReview}>
                                            <FaRegTrashCan className="text-xl hover:text-red-500 transition cursor-pointer" />
                                        </button>
                                    </>
                                )}
                        </div>
                    </div>
                    <p className="text-gray-600 text-pretty">
                        {review.description
                            .split(" ")
                            .map((word) =>
                                word.length > 30
                                    ? word.match(/.{1,30}/g)?.join("\n")
                                    : word,
                            )
                            .join(" ")}
                    </p>
                    {review.images && (
                        <PhotoProvider>
                            <div className="flex flex-wrap gap-3">
                                {review.images.map((image, i) => (
                                    <PhotoView
                                        key={i}
                                        src={`${getStrapiMedia(image.url)}`}
                                    >
                                        <StrapiImage
                                            key={image.id}
                                            src={image.url}
                                            alt={
                                                image.alternativeText ??
                                                review.user.username
                                            }
                                            width={300}
                                            height={300}
                                            className="w-20 md:w-32 h-16 md:h-24 rounded-xl cursor-pointer"
                                        />
                                    </PhotoView>
                                ))}
                            </div>
                        </PhotoProvider>
                    )}
                </div>
            )}
        </article>
    );
}
