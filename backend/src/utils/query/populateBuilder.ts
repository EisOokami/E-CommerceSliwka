import type {
    DrizzleWith,
    PopulateConfig,
    PopulateRelationConfig,
    RawPopulateInput,
} from "../../types/query.js";
import { ApiError } from "../apiError.js";

function buildColumns(
    fields: unknown,
    allowed: true | PopulateRelationConfig,
    path: string[],
): Record<string, true> | undefined {
    if (fields === undefined) {
        return undefined;
    }

    if (
        !Array.isArray(fields) ||
        fields.some((field) => typeof field !== "string")
    ) {
        throw new ApiError({
            statusCode: 400,
            message: `"fields" for populate relation "${path.join(".")}" must be an array of strings`,
        });
    }

    if (allowed === true || !allowed.fields) {
        throw new ApiError({
            statusCode: 400,
            message: `Relation "${path.join(".")}" does not support selecting specific fields`,
        });
    }

    const whitelist = new Set(allowed.fields);
    const columns: Record<string, true> = {};

    for (const field of fields as string[]) {
        if (!whitelist.has(field)) {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid field "${field}" for populate relation "${path.join(".")}"`,
            });
        }

        columns[field] = true;
    }

    return columns;
}

function defaultColumns(
    allowed: true | PopulateRelationConfig,
): Record<string, true> | undefined {
    if (allowed === true || !allowed.fields) {
        return undefined;
    }

    return Object.fromEntries(
        allowed.fields.map((field) => [field, true as const]),
    );
}

function buildLevel(
    input: RawPopulateInput,
    config: PopulateConfig,
    maxDepth: number,
    depth: number,
    path: string[],
): DrizzleWith {
    if (depth > maxDepth) {
        throw new ApiError({
            statusCode: 400,
            message: `Populate depth exceeds maximum allowed depth of ${maxDepth} at "${path.join(".")}"`,
        });
    }

    const result: DrizzleWith = {};

    for (const [key, value] of Object.entries(input)) {
        const allowed = config[key];

        if (!allowed) {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid populate relation "${[...path, key].join(".")}"`,
            });
        }

        if (value === true) {
            const columns = defaultColumns(allowed);

            result[key] = columns ? { columns } : true;

            continue;
        }

        const relationObject =
            value && typeof value === "object"
                ? (value as { populate?: RawPopulateInput; fields?: unknown })
                : undefined;

        const columns =
            buildColumns(relationObject?.fields, allowed, [...path, key]) ??
            defaultColumns(allowed);

        const nestedInput = relationObject?.populate;

        if (!nestedInput || Object.keys(nestedInput).length === 0) {
            result[key] = columns ? { columns } : true;

            continue;
        }

        if (allowed === true || !allowed.populate) {
            throw new ApiError({
                statusCode: 400,
                message: `Relation "${[...path, key].join(".")}" does not allow nested populate`,
            });
        }

        const nested: DrizzleWith[string] = {
            with: buildLevel(
                nestedInput,
                allowed.populate,
                maxDepth,
                depth + 1,
                [...path, key],
            ),
        };

        if (columns) {
            nested.columns = columns;
        }

        result[key] = nested;
    }

    return result;
}

export function buildPopulate(
    input: RawPopulateInput | undefined,
    config: PopulateConfig,
    maxDepth: number,
): DrizzleWith | undefined {
    if (!input) {
        return undefined;
    }

    return buildLevel(input, config, maxDepth, 1, []);
}
