import { ILink } from "@/interfaces/interfaces";
import { Dispatch, SetStateAction } from "react";

export interface NavigationProps {
    navigationLinks: ILink[];
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
