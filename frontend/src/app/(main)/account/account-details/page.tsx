import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";
import { redirect } from "next/navigation";

import AccountDetails from "@/components/layout/main/account/accountDetails/AccountDetails";

export default async function AccountDetailsPage() {
    const user = await getUserMeLoader();

    if (!user.ok) {
        redirect("/signIn");
    }

    return <AccountDetails userData={user.data} />;
}
