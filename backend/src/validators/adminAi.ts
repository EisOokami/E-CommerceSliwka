import { z } from "zod";
import { productRelationsSchema } from "./adminCatalog.js";
import { productSchema } from "./adminPanel.js";

export const generateDescriptionSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(1, "Product name cannot be empty")
        .max(255, "Product name must be 255 characters or fewer"),
    brand: z
        .string()
        .trim()
        .max(255, "Brand must be 255 characters or fewer")
        .optional(),
    category: z
        .string()
        .trim()
        .max(255, "Category must be 255 characters or fewer")
        .optional(),
    specifications: z
        .record(
            z.string().trim().min(1).max(100),
            z.string().trim().max(300),
            "Specifications must be an object",
        )
        .refine((value) => Object.keys(value).length <= 20, {
            message: "You can provide no more than 20 specifications",
        })
        .optional(),
    currentDescription: z
        .string()
        .trim()
        .max(6000, "Current description must be 6000 characters or fewer")
        .optional(),
});

export const generatedDescriptionSchema = z.strictObject({
    description: z
        .string()
        .trim()
        .min(1, "Generated description cannot be empty")
        .max(1500, "Generated description must be 1500 characters or fewer")
        .refine((value) => {
            const words = value.split(/\s+/u).length;
            return words >= 60 && words <= 100;
        }, "Generated description must contain between 60 and 100 words")
        .refine(
            (value) =>
                !/[*`#<>]|\[[^\]]+\]\([^)]+\)|(?:^|\n)\s*(?:[-+•]|\d+[.)])\s/u.test(
                    value,
                ) && !/^[^\n.!?]{1,80}:\s*(?:\n|$)/u.test(value),
            "Generated description must be plain text without headings, Markdown, or HTML",
        ),
});

export const autofillDetailsSchema = productRelationsSchema
    .pick({
        productVariants: true,
        options: true,
        productSpecifications: true,
        productSpecificationGroups: true,
        productInfos: true,
    })
    .extend({
        color: productSchema.shape.color.optional(),
        price: productSchema.shape.price.optional(),
        discountedPrice: productSchema.shape.discountedPrice
            .unwrap()
            .optional(),
        isDiscount: z.boolean().optional(),
    });
export const autofillProductSchema = generateDescriptionSchema
    .omit({ brand: true, currentDescription: true })
    .extend({
        description: z
            .string()
            .trim()
            .max(6000, "Description must be 6000 characters or fewer")
            .optional(),
        additionalInformation: z
            .string()
            .trim()
            .max(
                12000,
                "Additional information must be 12000 characters or fewer",
            )
            .optional(),
        existingDetails: z
            .preprocess((value) => {
                if (!value || typeof value !== "object") {
                    return value;
                }

                return Object.fromEntries(
                    Object.entries(autofillDetailsSchema.shape).flatMap(
                        ([key, schema]) => {
                            const field = schema.safeParse(
                                Reflect.get(value, key),
                            );

                            return field.success && field.data !== undefined
                                ? [[key, field.data]]
                                : [];
                        },
                    ),
                );
            }, autofillDetailsSchema)
            .optional(),
    });

export const generatedProductSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(1, "Product name cannot be empty")
        .max(255, "Product name must be 255 characters or fewer")
        .refine(
            (value) =>
                !/[<>]/u.test(value) &&
                [...value].every(
                    (character) =>
                        character.charCodeAt(0) >= 32 ||
                        ["\n", "\r", "\t"].includes(character),
                ),
            "Product name must not contain HTML tags or control characters",
        )
        .nullish(),
    description: z
        .string()
        .trim()
        .min(1, "Product description cannot be empty")
        .max(6000, "Product description must be 6000 characters or fewer")
        .refine(
            (value) =>
                !/[<>]/u.test(value) &&
                [...value].every(
                    (character) =>
                        character.charCodeAt(0) >= 32 ||
                        ["\n", "\r", "\t"].includes(character),
                ),
            "Product description must not contain HTML tags or control characters",
        )
        .nullish(),
    slug: z
        .string()
        .max(255, "Product slug must be 255 characters or fewer")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Product slug must contain only lowercase letters, numbers, and hyphens",
        )
        .nullish(),
    categoryId: z.uuid().nullish(),
    productSpecifications: z
        .array(
            z.strictObject({
                name: z
                    .string()
                    .trim()
                    .min(1, "Specification name cannot be empty")
                    .max(
                        100,
                        "Specification name must be 100 characters or fewer",
                    )
                    .refine(
                        (value) =>
                            !/[<>]/u.test(value) &&
                            [...value].every(
                                (character) =>
                                    character.charCodeAt(0) >= 32 ||
                                    ["\n", "\r", "\t"].includes(character),
                            ),
                        "Specification name must not contain HTML tags or control characters",
                    ),
                specification: z
                    .string()
                    .trim()
                    .min(1, "Specification value cannot be empty")
                    .max(
                        255,
                        "Specification value must be 255 characters or fewer",
                    )
                    .refine(
                        (value) =>
                            !/[<>]/u.test(value) &&
                            [...value].every(
                                (character) =>
                                    character.charCodeAt(0) >= 32 ||
                                    ["\n", "\r", "\t"].includes(character),
                            ),
                        "Specification value must not contain HTML tags or control characters",
                    ),
                icon: productRelationsSchema.shape.productSpecifications
                    .unwrap()
                    .element.shape.icon.optional(),
            }),
            "Product specifications must be an array",
        )
        .max(20, "You can provide no more than 20 product specifications")
        .nullish(),
});

export const recordSchema = z.record(z.string(), z.unknown(), {
    error: "Expected an object",
});

export const listSchema = z.array(z.unknown(), {
    error: "Expected an array",
});

export const shapeSchema = autofillDetailsSchema.shape;
export const variantSchema = shapeSchema.productVariants.unwrap().element;
export const optionSchema = shapeSchema.options.unwrap().element;
export const optionDetailSchema = optionSchema.shape.optionDetails.element;
export const groupSchema =
    shapeSchema.productSpecificationGroups.unwrap().element;
export const groupDetailSchema = groupSchema.shape.specifications.element;
export const specSchema = shapeSchema.productSpecifications.unwrap().element;
export const iconSchema = specSchema.shape.icon;
