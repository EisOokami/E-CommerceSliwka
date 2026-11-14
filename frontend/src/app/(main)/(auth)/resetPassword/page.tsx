import AccountRecovery from "@/components/layout/main/accountRecovery/AccountRecovery";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string; id?: string }>;
}) {
    const { token, id } = await searchParams;

    return <AccountRecovery mode="reset" token={token ?? ""} id={id ?? ""} />;
}
