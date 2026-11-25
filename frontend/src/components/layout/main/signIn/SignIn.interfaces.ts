import { IAuthPage } from "@/interfaces/authPage";

export interface SignInProps {
    pageData: IAuthPage;
    error?: string;
    mfaPending?: boolean;
}
