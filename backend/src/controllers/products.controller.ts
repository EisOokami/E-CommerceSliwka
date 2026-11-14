import type { Request, Response } from "express";
import { parseQuery } from "../utils/query/parseQuery.js";
import * as productsService from "../services/products.service.js";
import {
    productDetailSchema,
    productFiltersSchema,
    productSearchSchema,
} from "../validators/products.js";

export const getProducts = async (req: Request, res: Response) => {
    const query = parseQuery(req.query);

    const response = await productsService.getProducts(query);

    res.status(200).json(response);
};

export const getPriceRange = async (req: Request, res: Response) => {
    const query = parseQuery(req.query);

    const response = await productsService.getPriceRange(query);

    res.status(200).json(response);
};

export const getFilteredProducts = async (req: Request, res: Response) => {
    const query = parseQuery(req.query);

    const response = await productsService.getFilteredProducts(query);

    res.status(200).json(response);
};

export const getProductsCount = async (req: Request, res: Response) => {
    const response = await productsService.getProductsCount();

    res.status(200).json(response);
};

export const search = async (req: Request, res: Response) => {
    const validateData = productSearchSchema.parse(req.query);

    const response = await productsService.searchProducts(validateData);

    res.status(200).json(response);
};

export const facets = async (req: Request, res: Response) => {
    const validateData = productSearchSchema.parse(req.query);

    const response = await productsService.productFacets(validateData);

    res.status(200).json(response);
};

export const categories = async (req: Request, res: Response) => {
    const response = await productsService.publicCategories();

    res.status(200).json(response);
};

export const detail = async (req: Request, res: Response) => {
    const validateData = productDetailSchema.parse(req.params);

    const response = await productsService.findProduct(validateData.key);

    res.status(200).json(response);
};

export const filters = async (req: Request, res: Response) => {
    const validateData = productFiltersSchema.parse(req.query);

    const response = await productsService.categoryFilters(
        validateData.category,
    );

    res.status(200).json(response);
};
