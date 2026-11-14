import "server-only";

import { ZodError } from "zod";
import { AdminApiError, type ActionResult } from "./errors";

export async function actionResult<T>(
    run: () => Promise<T>,
): Promise<ActionResult<T>> {
    try {
        return { ok: true, data: await run() };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                ok: false,
                error: {
                    status: 400,
                    message: "Please correct the form fields.",
                    details: error.issues.map((issue) => {
                        return {
                            field: issue.path.join("."),
                            message: issue.message,
                        };
                    }),
                },
            };
        }

        if (error instanceof AdminApiError) {
            return {
                ok: false,
                error: {
                    status: error.status,
                    message: error.message,
                    details: error.details,
                },
            };
        }

        throw error;
    }
}
