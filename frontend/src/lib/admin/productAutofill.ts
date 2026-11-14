import type { ProductInput } from "@/interfaces/admin/api";
import type { ProductSuggestions } from "@/interfaces/admin/ai";

export const autofillFields: (keyof ProductSuggestions)[] = [
    "name",
    "description",
    "slug",
    "category",
    "color",
    "price",
    "discountedPrice",
    "isDiscount",
    "productVariants",
    "options",
    "productSpecifications",
    "productInfos",
    "productSpecificationGroups",
];

const mergeRows = <T extends object>(
    old: T[],
    added: T[],
    identity: (item: T) => string,
    combine?: (old: T, added: T) => T,
): T[] => {
    const result = old.filter(
        (item) =>
            identity(item).trim() ||
            Object.entries(item).some(([key, value]) => {
                if (key === "inStock") {
                    return value === false;
                }

                if (key === "hex") {
                    return value && value !== "#000000";
                }

                if (key === "icon") {
                    return value && value !== "phone";
                }

                return typeof value === "string"
                    ? value.trim()
                    : Array.isArray(value) && value.length > 0;
            }),
    );

    for (const item of added) {
        const index = result.findIndex(
            (entry) =>
                identity(entry).trim().toLowerCase().replace(/\s+/gu, " ") ===
                identity(item).trim().toLowerCase().replace(/\s+/gu, " "),
        );

        if (index < 0) {
            result.push(item);

            continue;
        }

        if (combine) {
            result[index] = combine(result[index], item);

            continue;
        }

        result[index] = Object.assign(
            {},
            result[index],
            Object.fromEntries(
                Object.entries(item).filter(
                    ([key]) =>
                        Reflect.get(result[index], key) === "" ||
                        Reflect.get(result[index], key) == null,
                ),
            ),
        );
    }

    return result;
};

export function planProductAutofill(
    snapshot: ProductInput,
    current: ProductInput,
    suggestions: ProductSuggestions,
    categories: string[],
    editedFields: ReadonlySet<keyof ProductInput> = new Set(),
) {
    const empty: Partial<ProductSuggestions> = {};
    const replacements: Partial<ProductSuggestions> = {};

    if (editedFields.has("name") || snapshot.name !== current.name) {
        return { empty, replacements };
    }

    for (const key of autofillFields) {
        if (
            editedFields.has(key) ||
            JSON.stringify(snapshot[key]) !== JSON.stringify(current[key])
        ) {
            continue;
        }

        let value: unknown = suggestions[key];

        if (value === undefined || value === null) {
            continue;
        }

        if (typeof value === "string" && !value.trim()) {
            continue;
        }

        if (Array.isArray(value) && value.length === 0) {
            continue;
        }

        if (key === "category" && !categories.includes(String(value))) {
            continue;
        }

        if (key === "productInfos") {
            const incoming = suggestions.productInfos?.[0];
            const existing = current.productInfos?.[0];

            value = incoming
                ? [
                      {
                          ...incoming,
                          ...existing,
                          delivery: existing?.delivery.trim()
                              ? existing.delivery
                              : incoming.delivery,
                          inStore: existing?.inStore.trim()
                              ? existing.inStore
                              : incoming.inStore,
                          guaranteed: existing?.guaranteed.trim()
                              ? existing.guaranteed
                              : incoming.guaranteed,
                      },
                  ]
                : current.productInfos;
        }

        if (key === "productSpecifications") {
            value = mergeRows(
                current.productSpecifications ?? [],
                suggestions.productSpecifications ?? [],
                (item) => item.name,
            );
        }

        if (key === "productVariants") {
            value = mergeRows(
                current.productVariants ?? [],
                suggestions.productVariants ?? [],
                (item) => item.name,
            );
        }

        if (key === "options") {
            value = mergeRows(
                current.options ?? [],
                (suggestions.options ?? []).map((group) => ({
                    ...group,
                    optionDetails: mergeRows(
                        [],
                        group.optionDetails,
                        (item) => item.name,
                    ),
                })),
                (group) => group.title,
                (old, added) => ({
                    ...old,
                    optionDetails: mergeRows(
                        old.optionDetails,
                        added.optionDetails,
                        (item) => item.name,
                    ),
                }),
            );
        }

        if (key === "productSpecificationGroups") {
            value = mergeRows(
                current.productSpecificationGroups ?? [],
                (suggestions.productSpecificationGroups ?? []).map((group) => ({
                    ...group,
                    specifications: mergeRows(
                        [],
                        group.specifications,
                        (item) => item.name,
                    ),
                })),
                (group) => group.name,
                (old, added) => ({
                    ...old,
                    specifications: mergeRows(
                        old.specifications,
                        added.specifications,
                        (item) => item.name,
                    ),
                }),
            );
        }

        if (
            Array.isArray(value) &&
            value.length >
                (key === "options" || key === "productSpecificationGroups"
                    ? 20
                    : key === "productVariants"
                      ? 30
                      : 50)
        ) {
            continue;
        }

        if (
            key === "options" &&
            (value as NonNullable<ProductSuggestions["options"]>).some(
                (group) => group.optionDetails.length > 30,
            )
        ) {
            continue;
        }

        if (
            key === "productSpecificationGroups" &&
            (
                value as NonNullable<
                    ProductSuggestions["productSpecificationGroups"]
                >
            ).some((group) => group.specifications.length > 50)
        ) {
            continue;
        }

        if (JSON.stringify(current[key]) === JSON.stringify(value)) {
            continue;
        }

        const existing = current[key];
        const target =
            typeof existing === "string"
                ? existing.trim().length > 0
                : existing !== undefined && existing !== null;

        Object.assign(target && !Array.isArray(value) ? replacements : empty, {
            [key]: value,
        });
    }

    return { empty, replacements };
}
