import type { ParsedQs } from "qs";
import type { QueryInput, QueryResourceConfig } from "../../types/query.js";
import { parseRawQuery } from "./parser.js";

export function parseQuery<TConfig extends QueryResourceConfig>(
    query: ParsedQs | Record<string, unknown>,
): QueryInput<TConfig> {
    return parseRawQuery(query) as QueryInput<TConfig>;
}
