import { cookies } from "next/headers";
import { getAuthPageData } from "@/data/main/loaders";

import SignIn from "@/components/layout/main/signIn/SignIn";

export default async function SignInPage({
    searchParams,
}: Readonly<{ searchParams: Promise<{ error?: string | string[] }> }>) {
    const [pageData, { error }, cookieStore] = await Promise.all([
        getAuthPageData(),
        searchParams,
        cookies(),
    ]);

    return (
        <SignIn
            pageData={pageData.signIn}
            error={typeof error === "string" ? error : undefined}
            mfaPending={cookieStore.has("customer_mfa")}
        />
    );
}
