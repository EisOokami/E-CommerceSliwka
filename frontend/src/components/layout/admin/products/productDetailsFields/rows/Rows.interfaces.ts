export interface RowsProps<T> {
    label: string;
    rows: T[];
    fields: {
        key: keyof T;
        label: string;
        type?: "text" | "color" | "checkbox";
    }[];
    emptyText?: string;
    blank: T;
    onChange: (rows: T[]) => void;
}
