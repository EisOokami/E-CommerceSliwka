import { getUserMeLoader } from "@/data/services/getUserMeLoader";

import AccountDetails from "@/components/layout/account/accountDetails/AccountDetails";

export default async function AccountDetailsPage() {
    const user = await getUserMeLoader();
    const userData = user.data;

    return <AccountDetails userData={userData} />;
}
