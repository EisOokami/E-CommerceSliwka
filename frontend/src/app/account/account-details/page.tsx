import { getUserMeLoader } from "@/data/services/getUserMeLoader";
import { redirect } from "next/navigation";

import AccountDetails from "@/components/layout/account/accountDetails/AccountDetails";

export default async function AccountDetailsPage() {
    const user = await getUserMeLoader();
    const userData = user.data;

    if (!user.ok) {
        redirect("/singIn");
    }

    return <AccountDetails userData={userData} />;
}
