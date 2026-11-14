import { getProduct, getProductCategories } from "@/data/admin/loaders";
import { getProductImages } from "@/data/admin/loaders/catalogLoaders";
import { requirePermissions } from "@/data/admin/services/server";
import { ProductEditorPageProps } from "./ProductEditorPage.interfaces";

import ProductEditor from "../productEditor/ProductEditor";

export default async function ProductEditorPage({
    id,
}: Readonly<ProductEditorPageProps>) {
    const admin = await requirePermissions([
        id ? "products.read" : "products.create",
    ]);
    const [product, categories, images] = await Promise.all([
        id ? getProduct(id) : null,
        getProductCategories(),
        admin.permissions.includes("products.read") ? getProductImages() : [],
    ]);

    const initialData = product
        ? {
              ...product,
              galleryIds:
                  product.sliderImages
                      ?.filter((image) => image.imageRole === "slider")
                      .map((image) => image.id) ?? [],
              discountedPrice: product.discountedPrice ?? "0",
          }
        : null;

    return (
        <ProductEditor
            id={id}
            initialData={initialData}
            categoryOptions={categories}
            images={images}
        />
    );
}
