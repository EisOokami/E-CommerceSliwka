import type { IBaseAction } from "@/interfaces/data";
import { StoreApiError } from "./http";
import z, { ZodError } from "zod";

export const emptyAction: IBaseAction = {
    zodErrors: null,
    strapiErrors: null,
    strapiErrorsDetails: null,
    formData: null,
    message: null,
};

export function actionFailure(
    error: unknown,
    fields: Record<string, string> = {},
): IBaseAction {
    if (error instanceof ZodError) {
        return {
            ...emptyAction,
            zodErrors: z.flattenError(error).fieldErrors,
            message: "Please check the form.",
        };
    }

    const message =
        error instanceof StoreApiError
            ? error.message
            : "The store service is unavailable. Please try again.";

    const details =
        error instanceof StoreApiError
            ? error.details.map((item) => {
                  return {
                      path: fields[item.field] ?? item.field,
                      message: item.message,
                      name: "ValidationError",
                      value: "",
                  };
              })
            : [];

    const zodErrors: Record<string, string[]> = {};

    details.forEach((item) => {
        (zodErrors[item.path] ??= []).push(item.message);
    });

    return {
        ...emptyAction,
        message,
        zodErrors: details.length ? zodErrors : null,
        strapiErrorsDetails: details.length ? details : null,
        strapiErrors: {
            status: error instanceof StoreApiError ? error.status : 503,
            name: "StoreError",
            message,
            details: {
                errors: details,
            },
        },
    };
}
