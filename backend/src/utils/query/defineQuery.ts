import type { Column } from "drizzle-orm";
import type { DefinedQuery, FieldKind, FiltersConfig, NormalizedFiltersConfig, NormalizedResourceConfig, PopulateConfig, QueryResourceConfig, SortConfig } from "../../types/query.js";

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_MAX_PAGE_SIZE = 100;
const DEFAULT_MAX_POPULATE_DEPTH = 5;

const NUMERIC_STRING_COLUMN_TYPES = new Set([
    "PgNumeric",
    "PgDecimal",
    "MySqlDecimal",
    "SQLiteNumeric",
]);

function inferFieldKind(column: Column): FieldKind {
    if (NUMERIC_STRING_COLUMN_TYPES.has(column.columnType)) {
        return "number";
    }

    switch (column.dataType) {
        case "number":
            return "number";
        case "date":
            return "date";
        case "boolean":
            return "boolean";
        default:
            return "text";
    }
}

export function defineQuery<
    const TPopulate extends PopulateConfig | undefined,
    const TFilters extends FiltersConfig | undefined,
    const TSort extends SortConfig | undefined,
>(
    config: QueryResourceConfig<TPopulate, TFilters, TSort>,
): DefinedQuery<QueryResourceConfig<TPopulate, TFilters, TSort>> {
    const normalizedFilters: NormalizedFiltersConfig = {};
    const filtersConfig = (config.filters ?? {}) as FiltersConfig;

    for (const [key, field] of Object.entries(filtersConfig)) {
        normalizedFilters[key] =
            typeof field === "object" &&
            field !== null &&
            "column" in field &&
            "kind" in field
                ? field
                : { column: field, kind: inferFieldKind(field) };
    }

    const normalized: NormalizedResourceConfig = {
        populate: config.populate ?? {},
        filters: normalizedFilters,
        sort: config.sort ?? {},
        defaultPageSize: config.defaultPageSize ?? DEFAULT_PAGE_SIZE,
        maxPageSize: config.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE,
        maxPopulateDepth: config.maxPopulateDepth ?? DEFAULT_MAX_POPULATE_DEPTH,
    };

    return { config, normalized };
}
