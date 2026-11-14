export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="flex min-h-[calc(100svh-76px)]">{children}</main>;
}
