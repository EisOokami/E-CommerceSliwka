import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { verifyCsrf } from "../middlewares/csrf.middleware.js";
import {
    createReview,
    deleteReview,
    getReviews,
    updateReview,
} from "../controllers/reviews.controller.js";
import {
    reviewInsertSchema,
    reviewUpdateSchema,
} from "../validators/reviews.js";

const router = Router();

router.get("/", authenticateToken, getReviews);
router.post(
    "/",
    authenticateToken,
    verifyCsrf,
    validateData(reviewInsertSchema),
    createReview,
);
router.put(
    "/:id",
    authenticateToken,
    verifyCsrf,
    validateData(reviewUpdateSchema),
    updateReview,
);
router.delete("/:id", authenticateToken, verifyCsrf, deleteReview);

export default router;
