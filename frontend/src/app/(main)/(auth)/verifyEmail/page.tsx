import AccountRecovery from "@/components/layout/main/accountRecovery/AccountRecovery";

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;

    return (
        <AccountRecovery
            mode={token ? "verify" : "resend"}
            token={token ?? ""}
        />
    );
}
