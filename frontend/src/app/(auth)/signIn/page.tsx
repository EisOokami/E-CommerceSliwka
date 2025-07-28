import { getAuthPageData } from "@/data/loaders";
import SignIn from "@/components/layout/signIn/SignIn";

export default async function SignInPage() {
    const pageData = await getAuthPageData();

    return <SignIn pageData={pageData.signIn} />;
}
