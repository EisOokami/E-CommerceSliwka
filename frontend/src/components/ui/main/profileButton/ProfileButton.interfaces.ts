import { ReactNode } from "react";

export interface ProfileButtonProps {
    isUserSingIn: boolean;
    text: string;
    handleCloseMenu: () => void;
}

export interface DropdownLinkProps {
    href: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
}
