import ProductEditorPage from "@/components/layout/admin/products/productEditorPage/ProductEditorPage";
import renderAdminPage from "@/data/admin/page";

export default async function Page() {
    return renderAdminPage(() => ProductEditorPage({}));
}
