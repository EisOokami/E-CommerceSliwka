import { Router } from "express";
import {
    getProducts,
    getPriceRange,
    getFilteredProducts,
    getProductsCount,
    search,
    facets,
    filters,
    categories,
    detail,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/search", search);
router.get("/facets", facets);
router.get("/filter-options", filters);
router.get("/categories", categories);
router.get("/by-key/:key", detail);
router.get("/", getProducts);
router.get("/price-range", getPriceRange);
router.get("/filtered", getFilteredProducts);
router.get("/count", getProductsCount);

export default router;
