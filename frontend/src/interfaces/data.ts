import { HttpStatusCode } from "@/types/types";

export interface IDetailsError {
    path: string;
    message: string;
    name: string;
    value: string;
}

export interface IApiErrorContent {
    status: HttpStatusCode;
    name: string;
    message: string;
    details: {
        errors: IDetailsError[];
    };
}

export interface IRestError {
    data: null;
    error: IApiErrorContent;
}

export interface IBaseZodErrors {
    [key: string]: string[] | undefined;
}

export interface IBaseAction {
    zodErrors: IBaseZodErrors | null;
    strapiErrors: IRestError["error"] | null;
    message: string | null;
    strapiErrorsDetails: IDetailsError[] | null;
    formData: FormData | null;
}

export interface IRegisterZodErrors extends IBaseZodErrors {
    username?: string[];
    email?: string[];
    password?: string[];
    agreeToTermsAndPrivacy?: string[];
}

export interface ILoginZodErrors extends IBaseZodErrors {
    identifier?: string[];
    password?: string[];
}

export interface IReviewZodErrors extends IBaseZodErrors {
    description?: string[];
    rating?: string[];
    images?: string[];
}

export interface IUpdateProfileZodErrors extends IBaseZodErrors {
    username?: string[];
    email?: string[];
    avatar?: string[];
}

export interface IChangePasswordZodErrors extends IBaseZodErrors {
    password?: string[];
    currentPassword?: string[];
    confirmPassword?: string[];
    confirmCurrentPassword?: string[];
}

export interface IRegisterAction extends IBaseAction {
    zodErrors: IRegisterZodErrors | null;
}

export interface ILoginAction extends IBaseAction {
    zodErrors: ILoginZodErrors | null;
}

export interface IAddReviewAction extends IBaseAction {
    zodErrors: IReviewZodErrors | null;
}

export interface IEditReviewAction extends IBaseAction {
    zodErrors: IReviewZodErrors | null;
}

export interface IUpdateProfileAction extends IBaseAction {
    data: {
        username: FormDataEntryValue | null;
        email: FormDataEntryValue | null;
        avatar?: string[] | null;
    } | null;
    zodErrors: IUpdateProfileZodErrors | null;
}

export interface IChangePasswordAction extends IBaseAction {
    data: {
        currentPassword?: FormDataEntryValue | null;
        password?: FormDataEntryValue | null;
        passwordConfirmation?: FormDataEntryValue | null;
    } | null;
    zodErrors: IChangePasswordZodErrors | null;
}
