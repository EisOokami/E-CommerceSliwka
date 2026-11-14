"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AdminIdentity, Reauthentication } from "@/interfaces/admin/api";
import { logoutAdmin } from "@/data/admin/services/services";
import ReauthDialog from "@/components/ui/admin/reauthDialog/ReauthDialog";

type Pending = {
    title: string;
    action: (credentials: Reauthentication) => Promise<unknown>;
    resolve: (ok: boolean) => void;
};

interface SessionContext {
    admin: AdminIdentity;
    can: (permission: string) => boolean;
    signOut: (all?: boolean) => Promise<void>;
    endSession: () => void;
    confirmAction: (
        title: string,
        action: Pending["action"],
    ) => Promise<boolean>;
}

const Context = createContext<SessionContext | null>(null);

export function useAdminSession() {
    const value = useContext(Context);

    if (!value) {
        throw new Error("Admin session provider is required");
    }

    return value;
}

export function AdminSessionProvider({
    children,
    initialAdmin,
}: {
    children: React.ReactNode;
    initialAdmin: AdminIdentity;
}) {
    const admin = initialAdmin;
    const [pending, setPending] = useState<Pending | null>(null);
    const pendingRef = useRef<Pending | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const finish = useCallback((ok: boolean) => {
        pendingRef.current?.resolve(ok);
        pendingRef.current = null;
        setPending(null);
    }, []);
    const endSession = useCallback(() => {
        finish(false);
        router.replace("/admin/login");
        router.refresh();
    }, [finish, router]);

    useEffect(() => {
        window.addEventListener("admin:unauthorized", endSession);

        return () => {
            window.removeEventListener("admin:unauthorized", endSession);
            pendingRef.current?.resolve(false);
        };
    }, [endSession]);

    const can = (permission: string) => admin.permissions.includes(permission);

    const requirements = pathname.startsWith("/admin/categories")
        ? ["categories.read"]
        : pathname.startsWith("/admin/reviews")
          ? ["reviews.read"]
          : pathname.startsWith("/admin/coupons")
            ? ["coupons.read"]
            : pathname.includes("product-creator")
              ? ["products.create"]
              : pathname.startsWith("/admin/products")
                ? ["products.read"]
                : pathname.startsWith("/admin/orders")
                  ? ["orders.read"]
                  : pathname.startsWith("/admin/customers")
                    ? ["users.read"]
                    : pathname.startsWith("/admin/roles")
                      ? ["admins.read"]
                      : pathname.startsWith("/admin/settings")
                        ? ["settings.read"]
                        : pathname.startsWith("/admin/dashboard")
                          ? // ||
                            //     pathname.startsWith("/admin/analytics")
                            ["products.read", "orders.read", "users.read"]
                          : [];

    const value: SessionContext = {
        admin,
        can,
        endSession,
        signOut: async (all = false) => {
            await logoutAdmin(all);

            endSession();
        },
        confirmAction: (title, action) =>
            new Promise((resolve) => {
                if (pendingRef.current) {
                    resolve(false);

                    return;
                }

                const next = { title, action, resolve };

                pendingRef.current = next;

                setPending(next);
            }),
    };

    return (
        <Context.Provider value={value}>
            {requirements.every(can) ? (
                children
            ) : (
                <div className="p-8">
                    <h1 className="font-semibold">Access denied</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Your account does not have permission to view this
                        section.
                    </p>
                    <button
                        className="mt-4 underline"
                        onClick={() => router.replace("/admin/security")}
                    >
                        Open account security
                    </button>
                </div>
            )}
            {pending && (
                <ReauthDialog
                    title={pending.title}
                    action={pending.action}
                    mfa={admin.mfaEnabled}
                    finish={finish}
                />
            )}
        </Context.Provider>
    );
}
