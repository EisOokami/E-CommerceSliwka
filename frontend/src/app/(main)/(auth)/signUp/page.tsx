import { getAuthPageData } from "@/data/main/loaders";

import SignUp from "@/components/layout/main/signUp/SignUp";

export default async function SingUpPage() {
    const pageData = await getAuthPageData();

    return <SignUp pageData={pageData.signUp} />;
}
