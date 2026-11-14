import "server-only";

import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { ZodError } from "zod";
import { AdminApiError } from "./services/errors";

import { RetryAdminPage } from "@/components/ui/admin/apiState/RetryAdminPage";

export default async function renderAdminPage(
    render: () => Promise<ReactNode>,
) {
    try {
        return await render();
    } catch (error) {
        if (error instanceof AdminApiError) {
            if (error.status === 401) {
                redirect("/admin/login");
            }

            if (error.status === 404) {
                notFound();
            }

            return (
                <section className="p-8" role="alert">
                    <h1 className="font-semibold">
                        {error.status === 403
                            ? "Access denied"
                            : "Unable to load this page"}
                    </h1>
                    <p className="mt-2 text-sm">{error.message}</p>
                    {error.status !== 403 && <RetryAdminPage />}
                    <a
                        href="/admin/security"
                        className="mt-4 ml-4 inline-block underline"
                    >
                        Account security
                    </a>
                </section>
            );
        }

        if (error instanceof ZodError) {
            return (
                <section className="p-8" role="alert">
                    Invalid page parameters. Please check the URL.
                </section>
            );
        }

        throw error;
    }
}
