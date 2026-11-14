import ProductEditorPage from "@/components/layout/admin/products/productEditorPage/ProductEditorPage";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return renderAdminPage(async () =>
        ProductEditorPage({ id: (await params).id }),
    );
}
