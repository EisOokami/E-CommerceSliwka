import Account from "@/components/layout/account/Account";
import { getUserMeLoader } from "@/data/services/getUserMeLoader";

export default async function AccountPage() {
    const user = await getUserMeLoader();
    const userData = user.data;

    return (
        <>
            <Account data={userData} />
        </>
    );
}
