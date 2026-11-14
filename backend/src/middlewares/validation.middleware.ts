import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export function validateData(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                }));

                res.status(400).json({
                    error: "Invalid data",
                    message: "Invalid data",
                    details: errorMessages,
                });
            } else {
                next(error);
            }
        }
    };
}
