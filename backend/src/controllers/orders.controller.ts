import type { Response } from "express";
import type { IGetUserRequest } from "../types/types.js";
import { parseQuery } from "../utils/query/parseQuery.js";
import * as ordersService from "../services/orders.service.js";
import {
    orderConfirmSchema,
    orderInsertSchema,
    orderHistorySchema,
} from "../validators/orders.js";

export const getOrders = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const query = parseQuery(req.query);

    const response = await ordersService.getOrders(req.user.id, query);

    res.status(200).json(response);
};

export const history = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const query = orderHistorySchema.parse(req.query);

    const response = await ordersService.getOrderHistory(
        req.user.id,
        query.page,
        query.pageSize,
        query.status,
    );

    res.status(200).json(response);
};

export const createOrder = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = orderInsertSchema.parse(req.body);

    const response = await ordersService.createOrder(req.user.id, validateData);

    res.status(201).json(response);
};

export const confirm = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = orderConfirmSchema.parse(req.body);

    const response = await ordersService.confirm(
        req.user.id,
        validateData.checkoutSession,
    );

    res.status(200).json(response);
};
