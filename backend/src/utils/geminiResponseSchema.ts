import { ApiError } from "./apiError.js";

export function geminiResponseSchema(schema: unknown): Record<string, unknown> {
    if (
        schema === null ||
        typeof schema !== "object" ||
        Array.isArray(schema)
    ) {
        throw new ApiError({
            statusCode: 500,
            message: "Invalid Gemini schema",
        });
    }

    const source = schema as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key of [
        "type",
        "description",
        "enum",
        "required",
        "additionalProperties",
    ]) {
        if (source[key] !== undefined) {
            result[key] = source[key];
        }
    }

    const { properties, items, anyOf } = source;

    if (properties !== undefined) {
        if (
            properties === null ||
            typeof properties !== "object" ||
            Array.isArray(properties)
        ) {
            throw new ApiError({
                statusCode: 500,
                message: "Invalid Gemini properties schema",
            });
        }

        result.properties = Object.fromEntries(
            Object.entries(properties).map(([name, property]) => [
                name,
                geminiResponseSchema(property),
            ]),
        );
    }

    if (items !== undefined) {
        result.items = geminiResponseSchema(items);
    }

    if (anyOf !== undefined) {
        if (!Array.isArray(anyOf)) {
            throw new ApiError({
                statusCode: 500,
                message: "Invalid Gemini anyOf schema",
            });
        }

        result.anyOf = anyOf.map((alternative) =>
            geminiResponseSchema(alternative),
        );
    }

    return result;
}
