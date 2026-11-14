"use client";

import { AdminApiError, type ActionResult } from "./errors";
export { AdminApiError, errorMessage } from "./errors";

export async function unwrapAction<T>(
    promise: Promise<ActionResult<T>>,
): Promise<T> {
    const result = await promise;

    if (result.ok) {
        return result.data;
    }

    if (result.error.status === 401) {
        window.dispatchEvent(new Event("admin:unauthorized"));
    }

    throw new AdminApiError(
        result.error.status,
        result.error.details.length
            ? result.error.details
                  .map((detail) => {
                      return detail.field + ": " + detail.message;
                  })
                  .join("; ")
            : result.error.message,
        result.error.details,
    );
}
