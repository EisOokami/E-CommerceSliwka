import { ILink } from "@/interfaces/interfaces";

export interface NavigationProps {
    navigationLinks: ILink[];
    handleCloseMenu: () => void;
}
