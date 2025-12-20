import { BaseSchema, IImage, ILink } from "./interfaces";

export interface IAuthPage extends BaseSchema {
    link: ILink;
    banner: IImage;
}
