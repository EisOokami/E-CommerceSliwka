import { IImage, Link } from "@/interfaces/interfaces";

export interface HeroProps {
    id: number;
    documentId: string;
    __component: string;
    heading: string;
    subHeading: string;
    image: IImage;
    link: Link;
}
