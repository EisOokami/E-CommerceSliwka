import { startCheckoutReconciliation } from "./jobs/checkoutReconciliation.js";
import { startFileCleanup } from "./jobs/fileCleanup.js";
import { createAdminRouter } from "./routes/admin.route.js";
import { validateAdminConfig } from "./config/admin.js";
import { startAdminSessionCleanup } from "./jobs/adminSessionCleanup.js";
import { pool } from "./db/index.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hostValidation from "host-validation";
import { issueCsrfCookie } from "./middlewares/csrf.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import cartsRoutes from "./routes/carts.route.js";
import uploadsRoutes from "./routes/uploads.route.js";
import ordersRoutes from "./routes/orders.route.js";
import productsRoutes from "./routes/products.route.js";
import reviewsRoutes from "./routes/reviews.route.js";
import usersRoutes from "./routes/users.route.js";
import wishlistsRoutes from "./routes/wishlists.route.js";
import path from "node:path";

dotenv.config({ quiet: true });

validateAdminConfig();

const app = express();

app.set("query parser", "extended");

if (process.env.TRUST_PROXY_HOPS) {
    app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS));
}

const port = process.env.PORT || 3001;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: {
        status: 429,
        error: "Too many requests",
        message: "Too many requests. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const hosts = process.env.HOSTS?.split(",");
const corsUrls = process.env.CORS_URLS?.split(",");

app.disable("x-powered-by");
app.use(hostValidation({ hosts: hosts }));
app.use("/api/admin", createAdminRouter());
app.use(
    cors({
        origin: corsUrls,
        credentials: true,
    }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(hpp());
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(limiter);
app.use(cookieParser());
app.use(issueCsrfCookie);

app.use("/api/auth", authRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/wishlists", wishlistsRoutes);

app.use(
    "/files",
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    }),
    express.static(
        path.resolve(
            process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
        ),
        {
            dotfiles: "deny",
            index: false,
            fallthrough: false,
            setHeaders: (res) => {
                res.setHeader("X-Content-Type-Options", "nosniff");
            },
        },
    ),
);

app.use(errorMiddleware);

const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});

const stopCleanup = startAdminSessionCleanup();
const stopFileCleanup = startFileCleanup();
const stopCheckouts = startCheckoutReconciliation();

let stopping = false;

function shutdown() {
    if (stopping) {
        return;
    }

    stopping = true;

    server.close(async () => {
        try {
            await Promise.all([
                stopCleanup(),
                stopFileCleanup(),
                stopCheckouts(),
            ]);
        } finally {
            await pool.end();
        }
    });

    setTimeout(() => server.closeAllConnections(), 10000).unref();
}

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
