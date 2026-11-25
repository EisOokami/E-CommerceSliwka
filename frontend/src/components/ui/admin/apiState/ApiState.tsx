import { outlineButtonClass } from "@/constants/styles";

export function ApiState({
    loading,
    error,
    retry,
}: {
    loading: boolean;
    error: string;
    retry: () => void;
}) {
    return (
        <div className="p-6 text-sm text-gray-500">
            {loading ? (
                "Loading..."
            ) : (
                <>
                    <p>{error}</p>
                    <button
                        type="button"
                        className={outlineButtonClass + " mt-3"}
                        onClick={retry}
                    >
                        Retry
                    </button>
                </>
            )}
        </div>
    );
}

export function StatusBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 capitalize">
            {children}
        </span>
    );
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block min-w-0 space-y-2 text-sm text-gray-700">
            <span className="font-medium">{label}</span>
            {children}
        </label>
    );
}
