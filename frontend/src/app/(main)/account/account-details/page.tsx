import { getUserMeLoader } from "@/data/main/services/getUserMeLoader";
import { redirect } from "next/navigation";

import AccountData from "@/components/layout/main/account/accountData/AccountData";
import AccountDetails from "@/components/layout/main/account/accountDetails/AccountDetails";

export default async function AccountDetailsPage() {
    const user = await getUserMeLoader();

    if (!user.ok) {
        redirect("/signIn");
    }

    return (
        <main className="grid gap-10 w-full">
            <AccountDetails userData={user.data} />
            <AccountData userData={user.data} />
        </main>
    );
}
