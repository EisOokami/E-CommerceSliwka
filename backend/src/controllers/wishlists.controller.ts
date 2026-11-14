import { type Response } from "express";
import type { IGetUserRequest } from "../types/types.js";
import { parseQuery } from "../utils/query/parseQuery.js";
import * as wishlistsService from "../services/wishlists.service.js";
import { wishlistInsertSchema } from "../validators/wishlists.js";
import { validateIdSchema } from "../validators/validators.js";

export async function getWishlists(req: IGetUserRequest, res: Response) {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const query = parseQuery(req.query);

    const response = await wishlistsService.getWishlists(req.user.id, query);

    res.status(200).json(response);
}

export async function createWishlist(req: IGetUserRequest, res: Response) {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = wishlistInsertSchema.parse(req.body);

    const response = await wishlistsService.createWishlist(
        req.user.id,
        validateData,
    );

    res.status(201).json(response);
}

export async function deleteWishlist(req: IGetUserRequest, res: Response) {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const validateData = validateIdSchema.parse(req.params);

    const response = await wishlistsService.deleteWishlist(
        req.user.id,
        validateData.id,
    );

    res.status(200).json(response);
}

export async function getWishlistsCount(req: IGetUserRequest, res: Response) {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            status: "error",
            message: "Authentication required",
        });

        return;
    }

    const response = await wishlistsService.getWishlistsCount(req.user.id);

    res.status(200).json(response);
}
