export interface ChartTooltipProps {
    active?: boolean;
    payload?: {
        color?: string;
        name?: string;
        value?: string | number;
    }[];
    label?: string | number;
}
