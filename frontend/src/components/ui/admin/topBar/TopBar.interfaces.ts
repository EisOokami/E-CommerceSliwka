export interface TopBarProps {
    title: string;
    actions?: React.ReactNode;
    crumbs?: {
        label: string;
        href?: string;
    }[];
}
