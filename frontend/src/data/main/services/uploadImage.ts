import "server-only";

import { mutateData } from "./mutateData";
import type { IImage } from "@/interfaces/interfaces";
import { mediaUrl } from "@/lib/utils";
import { imagesSchema } from "@/lib/schemas/main/image";
import { uuidSchema } from "@/lib/schemas/schemas";

export async function uploadImagesToStrapi(
    images: File[],
    target:
        | {
              field: "avatar";
          }
        | {
              field: "review";
              reviewId: string;
          },
): Promise<IImage[]> {
    imagesSchema.parse(images);

    if (target.field === "review") {
        uuidSchema.parse(target.reviewId);
    }

    if (!images.length) {
        return [];
    }

    const form = new FormData();

    form.set("field", target.field);

    if (target.field === "review") {
        form.set("reviewId", target.reviewId);
    }

    images.forEach((image) => {
        form.append("files", image);
    });

    const result = await mutateData<{
        data: {
            id: string;
            url: string;
        }[];
    }>("POST", "/api/uploads/multiple", form);

    return result.data.map((image) => {
        return {
            id: image.id,
            url: mediaUrl(image.url),
            alternativeText: "Uploaded image",
        };
    });
}
