import { getAdmin } from "@/data/admin/loaders";

import AdminEditor from "@/components/layout/admin/admins/adminEditor/AdminEditor";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return renderAdminPage(async () => {
        const { id } = await params;

        return <AdminEditor id={id} initialData={await getAdmin(id)} />;
    });
}
