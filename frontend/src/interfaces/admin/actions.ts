export interface BaseZodErrors {
    [key: string]: string[] | undefined;
}

export interface DetailsError {
    field: string;
    message: string;
}

export interface BaseAction {
    zodErrors: BaseZodErrors | null;
    status: "error" | "message" | "success" | null;
    message: string | null;
    error: string | null;
    details: DetailsError[] | null;
    formData: FormData | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

export interface AdminLoginZodErrors extends BaseZodErrors {
    email?: string[];
    password?: string[];
    tempToken?: string[];
    token?: string[];
}

export type CreateProjectZodErrors = BaseZodErrors;

export interface AdminLoginAction extends BaseAction {
    zodErrors: AdminLoginZodErrors | null;
}

export interface CreateProjectAction extends BaseAction {
    zodErrors: CreateProjectZodErrors | null;
}

