import type { ParsedQs } from "qs";
import type {
    PaginationInput,
    ParsedRawQuery,
    RawFiltersInput,
    RawPopulateInput,
    RawSortInput,
} from "../../types/query.js";
import { ApiError } from "../apiError.js";

function coerceBoolean(value: unknown): unknown {
    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return value;
}

function coerceFieldsList(value: unknown): string[] | undefined {
    if (value === undefined) {
        return undefined;
    }

    const array = Array.isArray(value)
        ? value
        : value !== null && typeof value === "object"
          ? Object.values(value as Record<string, unknown>)
          : [value];

    return array.map((value) => String(value));
}

function coercePopulate(input: unknown): RawPopulateInput | undefined {
    if (input === undefined || input === null) {
        return undefined;
    }

    if (typeof input !== "object" || Array.isArray(input)) {
        throw new ApiError({
            statusCode: 400,
            message: '"populate" must be an object',
        });
    }

    const result: RawPopulateInput = {};

    for (const [key, value] of Object.entries(
        input as Record<string, unknown>,
    )) {
        const boolValue = coerceBoolean(value);

        if (boolValue === true) {
            result[key] = true;

            continue;
        }

        if (typeof value === "object" && value !== null) {
            const nested = value as Record<string, unknown>;
            const populate = coercePopulate(nested.populate);
            const fields = coerceFieldsList(nested.fields);

            if (populate === undefined && fields === undefined) {
                result[key] = {};
            } else {
                result[key] = {
                    ...(populate !== undefined ? { populate } : {}),
                    ...(fields !== undefined ? { fields } : {}),
                };
            }

            continue;
        }
    }

    return result;
}

function coerceFilters(input: unknown): RawFiltersInput | undefined {
    if (input === undefined || input === null) {
        return undefined;
    }

    if (typeof input !== "object") {
        throw new ApiError({
            statusCode: 400,
            message: '"filters" must be an object',
        });
    }

    return coerceFiltersNode(
        input as Record<string, unknown>,
    ) as RawFiltersInput;
}

function normalizeToArray(value: unknown): unknown[] {
    if (Array.isArray(value)) {
        return value;
    }

    if (value !== null && typeof value === "object") {
        return Object.values(value as Record<string, unknown>);
    }

    return [];
}

function coerceFiltersNode(node: Record<string, unknown>): unknown {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(node)) {
        if (key === "$and" || key === "$or") {
            const arrayValue = normalizeToArray(value);

            result[key] = arrayValue.map((item) =>
                coerceFiltersNode(item as Record<string, unknown>),
            );

            continue;
        }

        if (key === "$not") {
            result[key] = coerceFiltersNode(value as Record<string, unknown>);

            continue;
        }

        if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
        ) {
            const operators: Record<string, unknown> = {};

            for (const [operator, operatorValue] of Object.entries(
                value as Record<string, unknown>,
            )) {
                if (operator === "$in" || operator === "$notIn") {
                    operators[operator] = normalizeToArray(operatorValue);
                } else if (operator === "$null" || operator === "$notNull") {
                    operators[operator] = coerceBoolean(operatorValue);
                } else {
                    operators[operator] = operatorValue;
                }
            }

            result[key] = operators;

            continue;
        }

        result[key] = value;
    }

    return result;
}

function coerceSort(input: unknown): RawSortInput | undefined {
    if (input === undefined || input === null) {
        return undefined;
    }

    if (typeof input !== "object" || Array.isArray(input)) {
        throw new ApiError({
            statusCode: 400,
            message: '"sort" must be an object',
        });
    }

    return input as RawSortInput;
}

function coercePagination(input: unknown): PaginationInput | undefined {
    if (input === undefined || input === null) {
        return undefined;
    }

    if (typeof input !== "object" || Array.isArray(input)) {
        throw new ApiError({
            statusCode: 400,
            message: '"pagination" must be an object',
        });
    }

    const raw = input as Record<string, unknown>;
    const result: PaginationInput = {};

    if (raw.page !== undefined) {
        result.page = coerceNumber(raw.page, "pagination.page");
    }

    if (raw.pageSize !== undefined) {
        result.pageSize = coerceNumber(raw.pageSize, "pagination.pageSize");
    }

    return result;
}

function coerceNumber(value: unknown, fieldPath: string): number {
    const numberValue = typeof value === "number" ? value : Number(value);

    if (
        typeof value !== "number" &&
        (typeof value !== "string" || value.trim() === "")
    ) {
        throw new ApiError({
            statusCode: 400,
            message: `"${fieldPath}" must be a number`,
        });
    }

    if (Number.isNaN(numberValue)) {
        throw new ApiError({
            statusCode: 400,
            message: `"${fieldPath}" must be a number`,
        });
    }

    return numberValue;
}

export function parseRawQuery(
    queryArg: ParsedQs | Record<string, unknown>,
): ParsedRawQuery {
    const query = queryArg as Record<string, unknown>;

    const populate = coercePopulate(query.populate);
    const filters = coerceFilters(query.filters);
    const sort = coerceSort(query.sort);
    const pagination = coercePagination(query.pagination);

    return {
        ...(populate !== undefined ? { populate } : {}),
        ...(filters !== undefined ? { filters } : {}),
        ...(sort !== undefined ? { sort } : {}),
        ...(pagination !== undefined ? { pagination } : {}),
    };
}
