import { ILink } from "@/interfaces/interfaces";
import { Dispatch, SetStateAction } from "react";

export interface HeaderIconsProps {
    iconsLink: ILink[];
    isUserSingIn: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
