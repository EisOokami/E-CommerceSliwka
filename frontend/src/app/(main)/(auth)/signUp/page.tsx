import { getAuthPageData } from "@/data/main/loaders";

import SignUp from "@/components/layout/main/signUp/SignUp";

export default async function SingUpPage({
    searchParams,
}: Readonly<{ searchParams: Promise<{ error?: string | string[] }> }>) {
    const [pageData, { error }] = await Promise.all([
        getAuthPageData(),
        searchParams,
    ]);

    return (
        <SignUp
            pageData={pageData.signUp}
            error={typeof error === "string" ? error : undefined}
        />
    );
}
