import { Collection } from "@/interfaces/admin/api";
import { ReactNode } from "react";

export interface Column<T extends { id: string }> {
    title: string;
    cell: (row: T, reload: () => void) => ReactNode;
}

export interface ResourceTableProps<T extends { id: string }> {
    title: string;
    columns: Column<T>[];
    initialData: Collection<T>;
    statuses?: string[];
    actions?: ReactNode;
    priceSort?: boolean;
}
