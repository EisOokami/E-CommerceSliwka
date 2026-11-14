import { requirePermissions } from "@/data/admin/services/server";
import { AdminApiError } from "@/data/admin/services/errors";

import AdminEditor from "@/components/layout/admin/admins/adminEditor/AdminEditor";
import renderAdminPage from "@/data/admin/page";

export default async function Page() {
    return renderAdminPage(async () => {
        const admin = await requirePermissions(["admins.manage"]);

        if (admin.role !== "super_admin") {
            throw new AdminApiError(
                403,
                "Only a super administrator can create administrators.",
            );
        }

        return <AdminEditor initialData={null} />;
    });
}
