import { getDashboard } from "@/data/admin/loaders";

import Dashboard from "@/components/layout/admin/dashboard/Dashboard";
import renderAdminPage from "@/data/admin/page";

export default async function Page() {
    return renderAdminPage(async () => (
        <Dashboard initialData={await getDashboard()} />
    ));
}
