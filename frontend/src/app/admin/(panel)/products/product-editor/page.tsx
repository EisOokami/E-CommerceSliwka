import { redirect } from "next/navigation";

export default async function ProductEditorPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;

    redirect(
        id ? "/admin/products/" + encodeURIComponent(id) : "/admin/products",
    );
}
