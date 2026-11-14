import { Status, VisibilityEnum } from "@/interfaces/interfaces";

export interface BadgeProps {
    label: Status | VisibilityEnum;
    variant: Status | VisibilityEnum;
}
