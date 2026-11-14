import type { Request, Response } from "express";
import { parseQuery } from "../utils/query/parseQuery.js";
import * as reviewsService from "../services/reviews.service.js";
import type { IGetUserRequest } from "../types/types.js";
import {
    reviewInsertSchema,
    reviewUpdateSchema,
} from "../validators/reviews.js";
import { validateIdSchema } from "../validators/validators.js";
import { removeUndefined } from "../utils/removeUndefined.js";

export const getReviews = async (req: Request, res: Response) => {
    const query = parseQuery(req.query);

    const response = await reviewsService.getReviews(query);

    res.status(200).json(response);
};

export const createReview = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = reviewInsertSchema.parse(req.body);

    const response = await reviewsService.createReview(
        req.user.id,
        validateData,
    );

    res.status(201).json(response);
};

export const updateReview = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);
    const validateData = removeUndefined(reviewUpdateSchema.parse(req.body));
    const query = parseQuery(req.query);

    const response = await reviewsService.updateReview(
        req.user.id,
        id,
        query,
        validateData,
    );

    res.status(200).json(response);
};

export const deleteReview = async (req: IGetUserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const { id } = validateIdSchema.parse(req.params);

    const response = await reviewsService.deleteReview(req.user.id, id);

    res.status(200).json(response);
};
