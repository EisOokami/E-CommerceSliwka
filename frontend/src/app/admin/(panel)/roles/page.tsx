import { getAdmins } from "@/data/admin/loaders";
import { loadList } from "@/data/admin/loadList";
import { SearchParams } from "@/types/types";

import Admins from "@/components/layout/admin/admins/Admins";
import renderAdminPage from "@/data/admin/page";

export default async function Page({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return renderAdminPage(async () => (
        <Admins
            initialData={await loadList(searchParams, "roles", getAdmins)}
        />
    ));
}
