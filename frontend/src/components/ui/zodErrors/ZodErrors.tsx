import { MdErrorOutline } from "react-icons/md";

export function ZodErrors({ error }: Readonly<{ error: string[] }>) {
    if (!error) {
        return null;
    }

    return error.map((err: string, index: number) => (
        <div
            key={index}
            className="flex items-center gap-1 py-1 text-sm text-red-500"
        >
            <div>
                <MdErrorOutline className="text-lg" />
            </div>
            <p>{err}</p>
        </div>
    ));
}
