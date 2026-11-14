import { getCategory } from "@/data/admin/loaders/catalogLoaders";

import CatalogEditor from "@/components/layout/admin/catalog/catalogEditor/CatalogEditor";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return renderAdminPage(async () => {
        const { id } = await params;

        return (
            <CatalogEditor
                resource="categories"
                id={id}
                initialData={await getCategory(id)}
            />
        );
    });
}
