import { IDetailsError, IRestError } from "@/interfaces/data";

export interface StrapiErrorsProps {
    error: IRestError["error"] | IDetailsError | null | undefined;
}
