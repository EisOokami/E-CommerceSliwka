import { getSecurityData } from "@/data/admin/services/session";

import Security from "@/components/layout/admin/settings/security/Security";
import renderAdminPage from "@/data/admin/page";

export default async function Page() {
    return renderAdminPage(async () => (
        <Security initialData={await getSecurityData()} />
    ));
}
