import { ReactNode } from "react";

export interface GroupSectionProps {
    title: string;
    addLabel: string;
    emptyText: string;
    count: number;
    onAdd: () => void;
    children: ReactNode;
}
