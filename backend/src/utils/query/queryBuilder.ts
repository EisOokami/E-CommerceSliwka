import type { ParsedQs } from "qs";
import type { BuiltClauses, DefinedQuery, DrizzleFindFirstArgs, DrizzleFindManyArgs, QueryInput, QueryResourceConfig } from "../../types/query.js";
import { parseRawQuery } from "./parser.js";
import { buildPopulate } from "./populateBuilder.js";
import { buildFilters } from "./filterBuilder.js";
import { buildSort } from "./sortBuilder.js";
import { buildPagination } from "./paginationBuilder.js";

function isAlreadyParsed(
    queryArg: unknown,
): queryArg is QueryInput<QueryResourceConfig> {
    if (queryArg === null || typeof queryArg !== "object") {
        return false;
    }

    const query = queryArg as Record<string, unknown>;

    const pagination = query.pagination as Record<string, unknown> | undefined;

    if (
        pagination &&
        (typeof pagination.page === "string" ||
            typeof pagination.pageSize === "string")
    ) {
        return false;
    }

    const populate = query.populate as Record<string, unknown> | undefined;

    if (populate) {
        for (const value of Object.values(populate)) {
            if (typeof value === "string") {
                return false;
            }
        }
    }

    return true;
}

function buildClauses<TConfig extends QueryResourceConfig>(
    query: QueryInput<TConfig> | ParsedQs | Record<string, unknown>,
    definedQuery: DefinedQuery<TConfig>,
): BuiltClauses {
    const { normalized } = definedQuery;

    const raw = isAlreadyParsed(query)
        ? query
        : parseRawQuery(query as ParsedQs);

    const populateInput = raw.populate;
    const filtersInput = raw.filters;
    const sortInput = raw.sort;

    const withClause = buildPopulate(
        populateInput,
        normalized.populate,
        normalized.maxPopulateDepth,
    );
    const whereClause = buildFilters(filtersInput, normalized.filters);
    const orderByClause = buildSort(sortInput, normalized.sort);
    const pagination = buildPagination(
        raw.pagination,
        normalized.defaultPageSize,
        normalized.maxPageSize,
    );

    const result: BuiltClauses = { pagination };

    if (withClause && Object.keys(withClause).length > 0) {
        result.with = withClause;
    }

    if (whereClause) {
        result.where = whereClause;
    }

    if (orderByClause) {
        result.orderBy = orderByClause;
    }

    return result;
}

export function buildQuery<TConfig extends QueryResourceConfig>(
    query: QueryInput<TConfig> | ParsedQs | Record<string, unknown>,
    definedQuery: DefinedQuery<TConfig>,
): DrizzleFindManyArgs {
    const {
        with: withClause,
        where,
        orderBy,
        pagination,
    } = buildClauses(query, definedQuery);

    const result: DrizzleFindManyArgs = {
        limit: pagination.limit,
        offset: pagination.offset,
    };

    if (withClause) {
        result.with = withClause;
    }

    if (where) {
        result.where = where;
    }

    if (orderBy) {
        result.orderBy = orderBy;
    }

    return result;
}

export function buildFindFirstQuery<
    TConfig extends QueryResourceConfig,
>(
    query: QueryInput<TConfig> | ParsedQs | Record<string, unknown>,
    definedQuery: DefinedQuery<TConfig>,
): DrizzleFindFirstArgs {
    const {
        with: withClause,
        where,
        orderBy,
    } = buildClauses(query, definedQuery);

    const result: DrizzleFindFirstArgs = {};

    if (withClause) {
        result.with = withClause;
    }

    if (where) {
        result.where = where;
    }

    if (orderBy) {
        result.orderBy = orderBy;
    }

    return result;
}
