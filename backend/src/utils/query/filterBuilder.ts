import {
    and,
    eq,
    gt,
    gte,
    ilike,
    inArray,
    isNotNull,
    isNull,
    lt,
    lte,
    ne,
    not,
    notInArray,
    or,
    type SQL,
} from "drizzle-orm";
import {
    OPERATORS_BY_KIND,
    type FilterOperator,
    type NormalizedFiltersConfig,
    type RawFiltersInput,
} from "../../types/query.js";
import { ApiError } from "../apiError.js";

function buildOperatorClause(
    operator: FilterOperator,
    value: unknown,
    column: NormalizedFiltersConfig[string]["column"],
    fieldName: string,
): SQL | undefined {
    switch (operator) {
        case "$eq":
            return eq(column, value);
        case "$ne":
            return ne(column, value);
        case "$gt":
            return gt(column, value);
        case "$gte":
            return gte(column, value);
        case "$lt":
            return lt(column, value);
        case "$lte":
            return lte(column, value);
        case "$in":
            if (!Array.isArray(value)) {
                throw new ApiError({
                    statusCode: 400,
                    message: `Operator "${operator}" on filter field "${fieldName}" requires an array value`,
                });
            }

            return inArray(column, value);
        case "$notIn":
            if (!Array.isArray(value)) {
                throw new ApiError({
                    statusCode: 400,
                    message: `Operator "${operator}" on filter field "${fieldName}" requires an array value`,
                });
            }

            return notInArray(column, value);
        case "$contains":
            return ilike(column, `%${value}%`);
        case "$notContains":
            return not(ilike(column, `%${value}%`));
        case "$startsWith":
            return ilike(column, `${value}%`);
        case "$endsWith":
            return ilike(column, `%${value}`);
        case "$null":
            return value ? isNull(column) : isNotNull(column);
        case "$notNull":
            return value ? isNotNull(column) : isNull(column);
        default: {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid operator "${operator}" for filter field "${fieldName}"`,
            });
        }
    }
}

function buildFieldClause(
    fieldName: string,
    rawValue: unknown,
    column: NormalizedFiltersConfig[string]["column"],
    kind: NormalizedFiltersConfig[string]["kind"],
): SQL | undefined {
    if (rawValue === null || typeof rawValue !== "object") {
        return eq(column, rawValue);
    }

    const allowedOperators = OPERATORS_BY_KIND[kind];
    const clauses: SQL[] = [];

    for (const [operator, operatorValue] of Object.entries(
        rawValue as Record<string, unknown>,
    )) {
        if (!allowedOperators.includes(operator as FilterOperator)) {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid operator "${operator}" for filter field "${fieldName}"`,
            });
        }

        const clause = buildOperatorClause(
            operator as FilterOperator,
            operatorValue,
            column,
            fieldName,
        );

        if (clause) {
            clauses.push(clause);
        }
    }

    if (clauses.length === 0) {
        return undefined;
    }

    if (clauses.length === 1) {
        return clauses[0];
    }

    return and(...clauses);
}

function buildNode(
    input: RawFiltersInput,
    config: NormalizedFiltersConfig,
    path: string[],
): SQL | undefined {
    const clauses: SQL[] = [];

    for (const [key, value] of Object.entries(input)) {
        if (key === "$and" || key === "$or") {
            const items = value as RawFiltersInput[];

            if (!Array.isArray(items)) {
                throw new ApiError({
                    statusCode: 400,
                    message: `"${key}" must be an array of filter groups`,
                });
            }

            const subClauses = items
                .map((item) => buildNode(item, config, [...path, key]))
                .filter((clause): clause is SQL => clause !== undefined);

            if (subClauses.length === 0) {
                continue;
            }

            const combined =
                key === "$and" ? and(...subClauses) : or(...subClauses);

            if (combined) {
                clauses.push(combined);
            }

            continue;
        }

        if (key === "$not") {
            const subClauses = buildNode(value as RawFiltersInput, config, [
                ...path,
                key,
            ]);

            if (subClauses) {
                clauses.push(not(subClauses));
            }

            continue;
        }

        const fieldConfig = config[key];

        if (!fieldConfig) {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid filter field "${[...path, key].join(".")}"`,
            });
        }

        const fieldClause = buildFieldClause(
            key,
            value,
            fieldConfig.column,
            fieldConfig.kind,
        );

        if (fieldClause) {
            clauses.push(fieldClause);
        }
    }

    if (clauses.length === 0) {
        return undefined;
    }

    if (clauses.length === 1) {
        return clauses[0];
    }

    return and(...clauses);
}

export function buildFilters(
    input: RawFiltersInput | undefined,
    config: NormalizedFiltersConfig,
): SQL | undefined {
    if (!input || Object.keys(input).length === 0) {
        return undefined;
    }

    return buildNode(input, config, []);
}
