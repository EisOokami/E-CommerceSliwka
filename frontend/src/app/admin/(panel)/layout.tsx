import { requireAdmin } from "@/data/admin/services/server";

import Sidebar from "@/components/ui/admin/sidebar/Sidebar";
import { AdminSessionProvider } from "@/components/layout/admin/auth/AdminSessionProvider";
import renderAdminPage from "@/data/admin/page";

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return renderAdminPage(async () => {
        const admin = await requireAdmin();

        return (
            <main className="flex h-svh overflow-hidden bg-gray-50">
                <AdminSessionProvider initialAdmin={admin}>
                    <Sidebar />
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                        {children}
                    </div>
                </AdminSessionProvider>
            </main>
        );
    });
}
