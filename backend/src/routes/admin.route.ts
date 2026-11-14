import images from "./adminImages.route.js";
import catalog from "./adminCatalog.route.js";
import { Router, json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { adminSecurity } from "../middlewares/adminSecurity.middleware.js";
import auth from "./adminAuth.route.js";
import panel from "./adminPanel.route.js";
import audit from "./audit.route.js";
import ai from "./adminAi.route.js";

export const createAdminRouter = () => {
    const router = Router();

    router.use(
        helmet(),
        cookieParser(),
        json({ limit: "128kb" }),
        adminSecurity,
    );
    router.use(
        cors({
            origin: (process.env.ADMIN_ORIGINS ?? "")
                .split(",")
                .map((value) => value.trim()),
            credentials: true,
        }),
    );
    router.use("/auth", auth);
    router.use("/audit-logs", audit);
    router.use("/ai", ai);
    router.use(images);
    router.use(catalog);
    router.use(panel);

    return router;
};
