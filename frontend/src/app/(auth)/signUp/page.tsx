import { getAuthPageData } from "@/data/loaders";
import SignUp from "@/components/layout/signUp/SignUp";

export default async function SingUpPage() {
    const pageData = await getAuthPageData();

    return <SignUp pageData={pageData.signUp} />;
}
