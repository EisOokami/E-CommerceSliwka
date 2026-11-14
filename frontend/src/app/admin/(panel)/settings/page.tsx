import { getSettings } from "@/data/admin/loaders";

import Settings from "@/components/layout/admin/settings/Settings";
import renderAdminPage from "@/data/admin/page";

export default async function Page() {
    return renderAdminPage(async () => (
        <Settings initialData={await getSettings()} />
    ));
}
