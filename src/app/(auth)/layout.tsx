export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="flex h-svh">{children}</main>;
}
