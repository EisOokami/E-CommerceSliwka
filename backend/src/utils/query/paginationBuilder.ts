import type { PaginationInput, ResolvedPagination } from "../../types/query.js";
import { ApiError } from "../apiError.js";

export function buildPagination(
    input: PaginationInput | undefined,
    defaultPageSize: number,
    maxPageSize: number,
): ResolvedPagination {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? defaultPageSize;

    if (!Number.isInteger(page) || page < 1) {
        throw new ApiError({
            statusCode: 400,
            message: `Invalid pagination: "page" must be a positive integer, got ${JSON.stringify(page)}`,
        });
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
        throw new ApiError({
            statusCode: 400,
            message: `Invalid pagination: "pageSize" must be a positive integer, got ${JSON.stringify(pageSize)}`,
        });
    }

    if (pageSize > maxPageSize) {
        throw new ApiError({
            statusCode: 400,
            message: `Invalid pagination: "pageSize" ${pageSize} exceeds maximum allowed value of ${maxPageSize}`,
        });
    }

    return {
        page,
        pageSize,
        limit: pageSize,
        offset: (page - 1) * pageSize,
    };
}
