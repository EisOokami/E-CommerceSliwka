import type { Response } from "express";
import type { IGetUserRequest } from "../types/types.js";
import * as cartsService from "../services/carts.service.js";
import { parseQuery } from "../utils/query/parseQuery.js";
import { validateIdSchema } from "../validators/validators.js";
import { cartInsertSchema, cartUpdateSchema } from "../validators/carts.js";

export const getCarts = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const query = parseQuery(req.query);

    const response = await cartsService.getCarts(req.user.id, query);

    res.status(200).json(response);
};

export const getCart = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);
    const query = parseQuery(req.query);

    const row = await cartsService.getCart(req.user.id, query, id);

    if (!row) {
        res.status(404).json({
            status: "error",
            message: "Cart item not found",
        });

        return;
    }

    res.status(200).json(row);
};

export const createCart = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = cartInsertSchema.parse(req.body);

    const response = await cartsService.createCart(req.user.id, validateData);

    res.status(201).json(response);
};

export const updateCart = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);
    const validateData = cartUpdateSchema.parse(req.body);
    const query = parseQuery(req.query);

    const response = await cartsService.updateCart(
        req.user.id,
        id,
        query,
        validateData,
    );

    res.status(200).json(response);
};

export const deleteCart = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);

    const response = await cartsService.deleteCart(req.user.id, id);

    res.status(200).json(response);
};
