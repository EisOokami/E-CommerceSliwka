"use client";

import { useState, type DragEvent } from "react";
import Image from "next/image";
import { LuTrash2, LuUpload } from "react-icons/lu";
import { useServerData } from "@/data/admin/useServerData";
import { errorMessage } from "@/data/admin/services/client";
import {
    deleteProductImage,
    uploadProductImage,
} from "@/data/admin/actions/catalogClient";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/interfaces/admin/catalog";
import { ProductImagesProps } from "./ProductImages.interfaces";

import { ApiState } from "@/components/ui/admin/apiState/ApiState";
import { useAdminSession } from "../../auth/AdminSessionProvider";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

export default function ProductImages({
    data,
    onChange,
    initialImages = [],
    availableImages,
}: Readonly<ProductImagesProps>) {
    const [busy, setBusy] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");
    const [uploaded, setUploaded] = useState<ProductImage[]>([]);
    const state = useServerData(availableImages);
    const { can, confirmAction } = useAdminSession();

    const images = [
        ...new Map(
            [...initialImages, ...(state.data ?? []), ...uploaded].map(
                (productImage) => [productImage.id, productImage],
            ),
        ).values(),
    ];

    const upload = async (file: File | undefined) => {
        if (!file) {
            return;
        }

        setBusy(true);
        setError("");

        try {
            const image = await uploadProductImage(file);

            setUploaded((prevState) => [...prevState, image]);

            if (!data.imageId) {
                onChange({ ...data, imageId: image.id });
            }

            if (data.imageId) {
                onChange({
                    ...data,
                    galleryIds: [...(data.galleryIds ?? []), image.id],
                });
            }
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(false);
        }
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();

        setDragging(false);

        const file = event.dataTransfer.files?.[0];

        if (busy || !file) {
            return;
        }

        if (!acceptedTypes.includes(file.type)) {
            setError("Only JPEG, PNG or WebP images can be uploaded.");

            return;
        }

        void upload(file);
    };

    return (
        <section className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Images
            </h2>
            {error && (
                <p role="alert" className="mb-3 text-xs text-red-600">
                    {error}
                </p>
            )}
            {state.error && <ApiState {...state} retry={state.reload} />}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((image) => {
                    const isMain = data.imageId === image.id;
                    const isGallery =
                        data.galleryIds?.includes(image.id) ?? false;
                    const canDelete =
                        can("products.delete") &&
                        data.imageId !== image.id &&
                        data.galleryIds &&
                        !data.galleryIds.includes(image.id);

                    return (
                        <div key={image.id} className="space-y-2">
                            <div
                                className={cn(
                                    "group relative aspect-square overflow-hidden rounded-lg bg-stone-100",
                                    isMain
                                        ? "border-2 border-gray-900"
                                        : "border border-gray-200",
                                )}
                            >
                                <Image
                                    unoptimized
                                    fill
                                    sizes="(min-width: 768px) 160px, 50vw"
                                    src={"/media" + image.fileUrl}
                                    alt={image.filename}
                                    className="object-contain"
                                />
                                {isMain && (
                                    <span className="absolute bottom-1.5 left-1.5 rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-medium text-white">
                                        Main
                                    </span>
                                )}
                                {canDelete && (
                                    <button
                                        type="button"
                                        title="Delete file"
                                        className="absolute right-1.5 top-1.5 rounded border border-gray-200 bg-white/90 p-1 text-gray-500 shadow-sm transition-opacity hover:bg-white hover:text-red-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 md:opacity-0 md:group-hover:opacity-100"
                                        onClick={async () => {
                                            if (
                                                await confirmAction(
                                                    "Permanently delete this unused image?",
                                                    (reauthentication) =>
                                                        deleteProductImage(
                                                            image.id,
                                                            reauthentication,
                                                        ),
                                                )
                                            ) {
                                                setUploaded((prevState) =>
                                                    prevState.filter(
                                                        (productImage) =>
                                                            productImage.id !==
                                                            image.id,
                                                    ),
                                                );

                                                state.reload();
                                            }
                                        }}
                                    >
                                        <LuTrash2 size={12} />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                <label className="flex items-center gap-1.5 text-[11px] text-gray-700">
                                    <input
                                        type="radio"
                                        name="mainImage"
                                        className="h-3.5 w-3.5 accent-gray-900"
                                        checked={isMain}
                                        onChange={() =>
                                            onChange({
                                                ...data,
                                                imageId: image.id,
                                                galleryIds: (
                                                    data.galleryIds ?? []
                                                ).filter(
                                                    (id) => id !== image.id,
                                                ),
                                            })
                                        }
                                    />
                                    Main
                                </label>
                                <label
                                    className={cn(
                                        "flex items-center gap-1.5 text-[11px] text-gray-700",
                                        isMain && "opacity-50",
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        className="h-3.5 w-3.5 rounded accent-gray-900"
                                        disabled={isMain}
                                        checked={isGallery}
                                        onChange={(e) =>
                                            onChange({
                                                ...data,
                                                galleryIds: e.target.checked
                                                    ? [
                                                          ...(data.galleryIds ??
                                                              []),
                                                          image.id,
                                                      ]
                                                    : (
                                                          data.galleryIds ?? []
                                                      ).filter(
                                                          (id) =>
                                                              id !== image.id,
                                                      ),
                                            })
                                        }
                                    />
                                    Gallery
                                </label>
                            </div>
                        </div>
                    );
                })}
                <label
                    onDragEnter={(event) => {
                        event.preventDefault();

                        if (!busy) {
                            setDragging(true);
                        }
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                        if (
                            !event.currentTarget.contains(
                                event.relatedTarget as Node | null,
                            )
                        ) {
                            setDragging(false);
                        }
                    }}
                    onDrop={handleDrop}
                    className={cn(
                        "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 transition-colors focus-within:ring-1 focus-within:ring-gray-400",
                        busy
                            ? "cursor-wait opacity-60"
                            : "hover:border-gray-400 hover:bg-neutral-50",
                        dragging && "border-gray-400 bg-neutral-50",
                    )}
                >
                    <input
                        type="file"
                        accept={acceptedTypes.join(",")}
                        disabled={busy}
                        className="sr-only"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];

                            e.target.value = "";

                            await upload(file);
                        }}
                    />
                    <LuUpload
                        size={20}
                        className={cn("text-gray-400", busy && "animate-pulse")}
                    />
                    <span className="text-center text-[11px] leading-snug text-gray-500">
                        {busy ? (
                            "Uploading..."
                        ) : (
                            <>
                                Drop or
                                <br />
                                click to upload
                            </>
                        )}
                    </span>
                </label>
            </div>
            {state.loading && (
                <p className="mt-3 text-xs text-gray-500">Loading images...</p>
            )}
            {!state.loading && !images.length && (
                <p className="mt-3 text-xs text-gray-500">
                    No uploaded images yet.
                </p>
            )}
            <p className="mt-3 text-[11px] text-gray-500">
                JPEG, PNG or WebP. Select one main image and up to 20 gallery
                images. Save the product to apply selections.
            </p>
        </section>
    );
}
