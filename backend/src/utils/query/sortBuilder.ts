import { asc, desc, type SQL } from "drizzle-orm";
import type {
    RawSortInput,
    SortConfig,
    SortDirection,
} from "../../types/query.js";
import { ApiError } from "../apiError.js";

const VALID_DIRECTIONS = new Set<SortDirection>(["asc", "desc"]);

export function buildSort(
    input: RawSortInput | undefined,
    config: SortConfig,
): SQL[] | undefined {
    if (!input || Object.keys(input).length === 0) {
        return undefined;
    }

    const clauses: SQL[] = [];

    for (const [field, direction] of Object.entries(input)) {
        const column = config[field];

        if (!column) {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid sort field "${field}"`,
            });
        }

        if (
            typeof direction !== "string" ||
            !VALID_DIRECTIONS.has(direction as SortDirection)
        ) {
            throw new ApiError({
                statusCode: 400,
                message: `Invalid sort direction "${String(direction)}" for field "${field}"`,
            });
        }

        clauses.push(direction === "asc" ? asc(column) : desc(column));
    }

    return clauses.length > 0 ? clauses : undefined;
}
