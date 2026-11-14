import type {
    Column,
    ColumnBaseConfig,
    ColumnDataType,
    SQL,
} from "drizzle-orm";
import type { buildPagination } from "../utils/query/paginationBuilder.js";

export type RawPopulateInput = Record<
    string,
    true | { populate?: RawPopulateInput; fields?: unknown } | unknown
>;

export interface PopulateRelationConfig {
    populate?: PopulateConfig;
    fields?: readonly string[];
}

export interface PopulateFieldsInput {
    fields?: string[];
}

export type PopulateConfig = Record<string, true | PopulateRelationConfig>;

export type DrizzleWith = Record<
    string,
    true | { with?: DrizzleWith; columns?: Record<string, true>; where?: SQL }
>;

export type RawFiltersInput = {
    $and?: RawFiltersInput[];
    $or?: RawFiltersInput[];
    $not?: RawFiltersInput;
    [field: string]: unknown;
};

export type FieldKind = "text" | "number" | "date" | "boolean";

export interface FilterFieldConfig<TColumn extends Column = Column> {
    column: TColumn;
    kind: FieldKind;
}

export interface NormalizedFiltersConfig {
    [field: string]: FilterFieldConfig;
}

export const NUMERIC_OPERATORS = [
    "$eq",
    "$ne",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$in",
    "$notIn",
    "$null",
    "$notNull",
] as const;
export const TEXT_OPERATORS = [
    "$eq",
    "$ne",
    "$contains",
    "$notContains",
    "$startsWith",
    "$endsWith",
    "$in",
    "$notIn",
    "$null",
    "$notNull",
] as const;
export const DATE_OPERATORS = NUMERIC_OPERATORS;
export const BOOLEAN_OPERATORS = ["$eq", "$ne", "$null", "$notNull"] as const;

export type NumericOperator = (typeof NUMERIC_OPERATORS)[number];
export type TextOperator = (typeof TEXT_OPERATORS)[number];
export type DateOperator = (typeof DATE_OPERATORS)[number];
export type BooleanOperator = (typeof BOOLEAN_OPERATORS)[number];

export type FilterOperator =
    NumericOperator | TextOperator | DateOperator | BooleanOperator;

export const OPERATORS_BY_KIND: Record<FieldKind, readonly FilterOperator[]> = {
    text: TEXT_OPERATORS,
    number: NUMERIC_OPERATORS,
    date: DATE_OPERATORS,
    boolean: BOOLEAN_OPERATORS,
};

export type RawSortInput = Record<string, unknown>;

export type SortConfig = Record<string, Column>;

export type SortDirection = "asc" | "desc";

export interface PaginationInput {
    page?: number;
    pageSize?: number;
}

export interface ResolvedPagination {
    limit: number;
    offset: number;
    page: number;
    pageSize: number;
}

export type FilterFieldInput = Column | FilterFieldConfig;

export type FiltersConfig = Record<string, FilterFieldInput>;

export interface QueryResourceConfig<
    TPopulate extends PopulateConfig | undefined = PopulateConfig | undefined,
    TFilters extends FiltersConfig | undefined = FiltersConfig | undefined,
    TSort extends SortConfig | undefined = SortConfig | undefined,
> {
    populate?: TPopulate;
    filters?: TFilters;
    sort?: TSort;
    defaultPageSize?: number;
    maxPageSize?: number;
    maxPopulateDepth?: number;
}

export interface NormalizedResourceConfig {
    populate: PopulateConfig;
    filters: NormalizedFiltersConfig;
    sort: SortConfig;
    defaultPageSize: number;
    maxPageSize: number;
    maxPopulateDepth: number;
}

export interface DefinedQuery<
    TConfig extends QueryResourceConfig,
> {
    readonly config: TConfig;
    readonly normalized: NormalizedResourceConfig;
}

export type PopulateInput<TPopulate extends PopulateConfig | undefined> =
    TPopulate extends PopulateConfig
        ? {
              [K in keyof TPopulate]?: TPopulate[K] extends {
                  populate: infer TNested extends PopulateConfig;
              }
                  ? true | { populate?: PopulateInput<TNested> }
                  : true;
          }
        : never;

type ScalarForKind<K extends FieldKind> = K extends "number"
    ? number
    : K extends "date"
      ? Date | string
      : K extends "boolean"
        ? boolean
        : string;

export type FilterValue<K extends FieldKind> = {
    [Op in (typeof OPERATORS_BY_KIND)[K][number]]?: Op extends "$in" | "$notIn"
        ? ScalarForKind<K>[]
        : Op extends "$null" | "$notNull"
          ? boolean
          : ScalarForKind<K>;
};

type KindFromDataType<T extends ColumnDataType> = T extends "number"
    ? "number"
    : T extends "date"
      ? "date"
      : T extends "boolean"
        ? "boolean"
        : "text";

type KindOf<TField extends FilterFieldInput> = TField extends {
    kind: infer K extends FieldKind;
}
    ? K
    : TField extends Column<
            infer TConfig extends ColumnBaseConfig<ColumnDataType, string>
        >
      ? KindFromDataType<TConfig["dataType"]>
      : "text";

export type FiltersInput<TFilters extends FiltersConfig | undefined> =
    TFilters extends FiltersConfig
        ? {
              [K in keyof TFilters]?: FilterValue<KindOf<TFilters[K]>>;
          } & {
              $and?: FiltersInput<TFilters>[];
              $or?: FiltersInput<TFilters>[];
              $not?: FiltersInput<TFilters>;
          }
        : never;

export type SortInput<TSort extends SortConfig | undefined> =
    TSort extends SortConfig ? { [K in keyof TSort]?: SortDirection } : never;

export interface QueryInput<
    TConfig extends QueryResourceConfig,
> {
    populate?: PopulateInput<TConfig["populate"]>;
    filters?: FiltersInput<TConfig["filters"]>;
    sort?: SortInput<TConfig["sort"]>;
    pagination?: PaginationInput;
}

export interface BuiltClauses {
    with?: DrizzleWith;
    where?: SQL;
    orderBy?: SQL[];
    pagination: ReturnType<typeof buildPagination>;
}

export interface DrizzleFindManyArgs {
    with?: DrizzleWith;
    where?: SQL;
    orderBy?: SQL[];
    limit: number;
    offset: number;
}

export interface DrizzleFindFirstArgs {
    with?: DrizzleWith;
    where?: SQL;
    orderBy?: SQL[];
}

export interface ParsedRawQuery {
    populate?: RawPopulateInput;
    filters?: RawFiltersInput;
    sort?: RawSortInput;
    pagination?: PaginationInput;
}
