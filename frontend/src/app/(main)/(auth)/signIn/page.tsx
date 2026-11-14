import { getAuthPageData } from "@/data/main/loaders";

import SignIn from "@/components/layout/main/signIn/SignIn";

export default async function SignInPage() {
    const pageData = await getAuthPageData();

    return <SignIn pageData={pageData.signIn} />;
}
