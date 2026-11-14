import type { Request, Response } from "express";
import * as adminAiService from "../services/adminAi.service.js";
import * as adminCatalogService from "../services/adminCatalog.service.js";
import {
    autofillProductSchema,
    generateDescriptionSchema,
} from "../validators/adminAi.js";

export async function generateDescription(req: Request, res: Response) {
    res.setHeader("Cache-Control", "no-store");

    const validateData = generateDescriptionSchema.parse(req.body);

    const result = await adminAiService.generateDescription(validateData);

    res.status(200).json(result);
}

export async function autofillProduct(req: Request, res: Response) {
    res.setHeader("Cache-Control", "no-store");

    const validateData = autofillProductSchema.parse(req.body);

    const categories = await adminCatalogService.categoryList();
    const result = await adminAiService.autofillProduct(
        validateData,
        categories.map(({ id, name }) => ({ id, name })),
    );

    const links = [
        ...(result.productVariants ?? []).map((item) => item.productSlug),
        ...(result.options ?? []).flatMap((group) =>
            group.optionDetails.map((item) => item.productSlug),
        ),
    ].filter((value): value is string => Boolean(value));

    const existingProductSlugs =
        await adminCatalogService.existingAiProductSlugs(links);

    const safeLink = <T extends { productSlug: string | null }>(
        item: T,
    ): T => ({
        ...item,
        productSlug:
            item.productSlug && existingProductSlugs.has(item.productSlug)
                ? item.productSlug
                : null,
    });

    if (result.productVariants) {
        result.productVariants = result.productVariants.map(safeLink);
    }

    if (result.options) {
        result.options = result.options.map((group) => ({
            ...group,
            optionDetails: group.optionDetails.map(safeLink),
        }));
    }

    res.status(200).json(result);
}
