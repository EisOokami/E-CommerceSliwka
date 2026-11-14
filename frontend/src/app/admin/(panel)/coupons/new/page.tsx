import { requirePermissions } from "@/data/admin/services/server";

import CatalogEditor from "@/components/layout/admin/catalog/catalogEditor/CatalogEditor";
import renderAdminPage from "@/data/admin/page";

export default async function Page() {
    return renderAdminPage(async () => {
        await requirePermissions(["coupons.create"]);

        return <CatalogEditor resource="coupons" initialData={null} />;
    });
}
