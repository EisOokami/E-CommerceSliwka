import {
    pgTable,
    pgEnum,
    integer,
    varchar,
    text,
    boolean,
    date,
    timestamp,
    numeric,
    jsonb,
    index,
    uniqueIndex,
    check,
    type AnyPgColumn,
    uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { CartItem } from "../types/types.js";

export const deliveryStatusEnum = pgEnum("delivery_status", [
    "Delivered",
    "Shipped",
    "Processing",
    "Cancelled",
]);

export const categoriesEnum = pgEnum("categories", [
    "Smartphones",
    "Smartwatches",
    "Cameras",
    "Headphones",
    "Computers",
    "Laptops",
    "Gaming",
    "Other",
]);

export const iconsEnum = pgEnum("icons", [
    "phone",
    "cpu",
    "mainCamera",
    "frontCamera",
    "battery",
    "displayVr",
    "refresh",
    "weight",
    "laptop",
    "storage",
    "headphone",
    "noise",
    "sensor",
    "iso",
    "autofocus",
    "resolution",
    "screen",
]);

export const visibilityEnum = pgEnum("visibility", [
    "visible",
    "draft",
    "hidden",
]);

export const authProviderEnum = pgEnum("auth_provider", ["local", "google"]);

export const imageRoleEnum = pgEnum("image_role", ["main", "slider"]);

export const auditActionEnum = pgEnum("audit_action", [
    "LOGIN",
    "LOGIN_FAILED",
    "LOGOUT",
    "LOGOUT_ALL",
    "SESSION_REVOKED",
    "MFA_ENABLED",
    "MFA_DISABLED",
    "PASSWORD_CHANGED",
    "USER_CREATED",
    "USER_UPDATED",
    "USER_DELETED",
    "PRODUCT_CREATED",
    "PRODUCT_UPDATED",
    "PRODUCT_DELETED",
    "ORDER_UPDATED",
    "ORDER_REFUNDED",
    "ADMIN_CREATED",
    "ADMIN_UPDATED",
    "ADMIN_DELETED",
    "PERMISSION_CHANGED",
    "API_KEY_GENERATED",
    "STEP_UP_AUTH_SUCCEEDED",
    "STEP_UP_AUTH_FAILED",
    "SETTINGS_UPDATED",
    "CATEGORY_CREATED",
    "CATEGORY_UPDATED",
    "CATEGORY_DELETED",
    "REVIEW_UPDATED",
    "REVIEW_DELETED",
    "COUPON_CREATED",
    "COUPON_UPDATED",
    "COUPON_DELETED",
    "IMAGE_CREATED",
    "IMAGE_DELETED",
]);

export const adminRoleEnum = pgEnum("admin_role", [
    "super_admin",
    "admin",
    "manager",
    "support",
]);

const baseColumns = {
    id: uuid()
        .primaryKey()
        .default(sql`uuidv7()`),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
};

export const files = pgTable(
    "files",
    {
        ...baseColumns,
        uploaderId: uuid("uploader_id").references((): AnyPgColumn => users.id),
        filename: varchar("filename", { length: 255 }).notNull(),
        fileUrl: varchar("file_url", { length: 500 }).notNull(),
        mimeType: varchar("mime_type", { length: 100 }),
        sizeBytes: integer("size_bytes"),
        imageRole: imageRoleEnum("image_role"),
        sortOrder: integer("sort_order").notNull().default(0),
        productId: uuid("product_id").references(() => products.id),
        reviewId: uuid("review_id").references((): AnyPgColumn => reviews.id),
    },
    (table) => [
        index("files_product_id_index").on(table.productId),
        index("files_review_id_index").on(table.reviewId),
    ],
);

export const users = pgTable(
    "users",
    {
        ...baseColumns,
        username: varchar("username", { length: 255 }).notNull().unique(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: varchar("password", { length: 255 }),
        resetPasswordToken: varchar("reset_password_token", { length: 255 }),
        confirmationToken: varchar("confirmation_token", { length: 255 }),
        confirmationTokenExpires: timestamp("confirmation_token_expires", {
            withTimezone: true,
        }),
        confirmed: boolean("confirmed").default(false),
        blocked: boolean("blocked").default(false),
        agreeToTermsAndPrivacy: boolean("agree_to_terms_and_privacy").notNull(),
        avatarId: uuid("avatar_id").references(() => files.id),
        googleId: varchar("google_id", { length: 255 }),
        authProvider: authProviderEnum("auth_provider")
            .notNull()
            .default("local"),
        resetToken: varchar("reset_token", { length: 255 }),
        resetTokenExpiresAt: timestamp("reset_token_expires_at", {
            withTimezone: true,
        }),
        mfaEnabled: boolean("mfa_enabled").notNull().default(false),
        mfaSecret: varchar("mfa_secret", { length: 255 }),
        mfaEnabledAt: timestamp("mfa_enabled_at", { withTimezone: true }),
        avatarUrl: varchar("avatar_url", { length: 255 }),
        pendingEmail: varchar("pending_email", { length: 255 }),
        emailChangeToken: varchar("email_change_token", { length: 64 }),
        emailChangeExpiresAt: timestamp("email_change_expires_at", {
            withTimezone: true,
        }),
    },
    (table) => [
        index("users_avatar_id_index").on(table.avatarId),
        uniqueIndex("users_email_change_token_index").on(
            table.emailChangeToken,
        ),
    ],
);

export const userSessions = pgTable("user_sessions", {
    id: uuid()
        .primaryKey()
        .default(sql`uuidv7()`),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
    ip: varchar("ip", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revoked: boolean("revoked").notNull().default(false),
    replacedBy: varchar("replaced_by", { length: 36 }),
    replacedAt: timestamp("replaced_at", { withTimezone: true }),
});

export const mfaBackupCodes = pgTable(
    "mfa_backup_codes",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`uuidv7()`),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
        codeHash: varchar("code_hash", { length: 64 }).notNull(),
        usedAt: timestamp("used_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [index("mfa_backup_codes_user_id_index").on(table.userId)],
);

export const mfaLoginSessions = pgTable(
    "mfa_login_sessions",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`uuidv7()`),
        tokenHash: varchar("token_hash", { length: 64 }).notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
        ip: varchar("ip", { length: 45 }),
        userAgent: varchar("user_agent", { length: 255 }),
        attempts: integer("attempts").notNull().default(0),
        expiresAt: timestamp("expires_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [index("mfa_login_sessions_user_id_index").on(table.userId)],
);

export const oauthExchangeCodes = pgTable(
    "oauth_exchange_codes",
    {
        code: varchar("code", { length: 64 }).notNull().unique(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        usedAt: timestamp("used_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [index("oauth_exchange_codes_user_id_index").on(table.userId)],
);

export const categories = pgTable("product_categories", {
    ...baseColumns,
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").notNull().default(""),
});

export const coupons = pgTable(
    "coupons",
    {
        ...baseColumns,
        code: varchar("code", { length: 50 }).notNull().unique(),
        kind: varchar("kind", { length: 10 }).notNull(),
        amount: integer("amount").notNull(),
        currency: varchar("currency", { length: 3 }).notNull().default("usd"),
        enabled: boolean("enabled").notNull().default(true),
        expiresAt: timestamp("expires_at", { withTimezone: true }),
        usageLimit: integer("usage_limit"),
        minimumMinor: integer("minimum_minor").notNull().default(0),
    },
    (t) => [
        check("coupon_kind", sql`${t.kind} in ('percentage', 'fixed')`),
        check(
            "coupon_amount",
            sql`${t.amount} > 0 and (${t.kind} <> 'percentage' or ${t.amount} <= 100)`,
        ),
        check("coupon_minimum", sql`${t.minimumMinor} >= 0`),
        check(
            "coupon_limit",
            sql`${t.usageLimit} is null or ${t.usageLimit} > 0`,
        ),
    ],
);

export const couponRedemptions = pgTable(
    "coupon_redemptions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        couponId: uuid("coupon_id")
            .notNull()
            .references(() => coupons.id),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
        stripeId: varchar("stripe_id", { length: 255 }).unique(),
        discountMinor: integer("discount_minor").notNull(),
        usedAt: timestamp("used_at", { withTimezone: true }),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    },
    (t) => [index("coupon_redemptions_coupon_idx").on(t.couponId)],
);

export const products = pgTable(
    "products",
    {
        ...baseColumns,
        imageId: uuid("image_id")
            .notNull()
            .references((): AnyPgColumn => files.id),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description").notNull(),
        price: numeric("price", { precision: 19, scale: 4 }).notNull(),
        isDiscount: boolean("is_discount").default(false),
        discountedPrice: numeric("discounted_price", {
            precision: 19,
            scale: 4,
        }).default("0"),
        finalPrice: numeric("final_price", { precision: 19, scale: 4 }),
        averageRating: numeric("average_rating", {
            precision: 19,
            scale: 4,
        }).default("0"),
        slug: varchar("slug", { length: 255 }).notNull().unique(),
        category: varchar("category", { length: 255 })
            .notNull()
            .references(() => categories.name, {
                onUpdate: "cascade",
                onDelete: "restrict",
            }),
        quantity: integer("quantity").notNull(),
        color: varchar("color", { length: 7 }),
        inStock: boolean("in_stock").notNull().default(true),
        visibility: visibilityEnum("visibility").notNull().default("hidden"),
    },
    (table) => [
        index("products_image_id_index").on(table.imageId),
        uniqueIndex("products_slug_index").on(table.slug),
        index("products_price_index").on(table.price),
        check("discounted_price_check", sql`${table.discountedPrice} >= 0`),
        check("average_rating_min_check", sql`${table.averageRating} >= 0`),
        check("average_rating_max_check", sql`${table.averageRating} <= 5`),
        check("quantity_check", sql`${table.quantity} >= 0`),
    ],
);

export const carts = pgTable(
    "carts",
    {
        ...baseColumns,
        quantity: integer("quantity").notNull(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
    },
    (table) => [
        index("carts_product_id_index").on(table.productId),
        index("carts_user_id_index").on(table.userId),
        check("carts_quantity_check", sql`${table.quantity} >= 0`),
    ],
);

export const orders = pgTable(
    "orders",
    {
        ...baseColumns,
        stockReserved: boolean("stock_reserved").notNull().default(false),
        checkoutExpiresAt: timestamp("checkout_expires_at", {
            withTimezone: true,
        }),
        totalMinor: integer("total_minor"),
        currency: varchar("currency", { length: 3 }),
        stripeId: varchar("stripe_id", { length: 255 }).notNull().unique(),
        // regex: ^ORD-[a-z0-9]+-[A-Z0-9]{6}$
        orderId: varchar("order_id", { length: 255 }).notNull().unique(),
        isSuccess: boolean("is_success"),
        deliveryStatus:
            deliveryStatusEnum("delivery_status").default("Processing"),
        estimatedDelivery: date("estimated_delivery"),
        // regex: ^[A-Z]{2}[0-9]{9}$
        trackingNumber: varchar("tracking_number", { length: 255 }).unique(),
        cartItems: jsonb("cart_items").$type<CartItem[]>().notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
    },
    (table) => [index("orders_user_id_index").on(table.userId)],
);

export const productVariants = pgTable(
    "product_variants",
    {
        ...baseColumns,
        productSlug: varchar("product_slug", { length: 255 }),
        name: varchar("name", { length: 255 }).notNull(),
        // regex: ^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
        hex: varchar("hex", { length: 255 }).notNull().default("#"),
        inStock: boolean("in_stock").notNull().default(true),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id),
    },
    (table) => [
        index("product_variants_product_id_index").on(table.productId),
        check(
            "product_variants_hex_min_length_check",
            sql`length(${table.hex}) >= 4`,
        ),
        check(
            "product_variants_hex_max_length_check",
            sql`length(${table.hex}) <= 7`,
        ),
    ],
);

export const options = pgTable(
    "options",
    {
        ...baseColumns,
        title: varchar("title", { length: 255 }).notNull(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id),
    },
    (table) => [index("options_product_id_index").on(table.productId)],
);

export const optionDetails = pgTable(
    "option_details",
    {
        ...baseColumns,
        name: varchar("name", { length: 255 }).notNull(),
        productSlug: varchar("product_slug", { length: 255 }),
        inStock: boolean("in_stock").notNull().default(true),
        optionId: uuid("option_id")
            .notNull()
            .references(() => options.id),
    },
    (table) => [index("option_details_option_id_index").on(table.optionId)],
);

export const productSpecifications = pgTable(
    "product_specifications",
    {
        ...baseColumns,
        name: varchar("name", { length: 255 }).notNull(),
        specification: varchar("specification", { length: 255 }).notNull(),
        icon: iconsEnum("icon").notNull(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id),
    },
    (table) => [
        index("product_specifications_product_id_index").on(table.productId),
    ],
);

export const productInfos = pgTable(
    "product_infos",
    {
        ...baseColumns,
        delivery: varchar("delivery", { length: 255 }).notNull(),
        inStore: varchar("in_store", { length: 255 }).notNull(),
        guaranteed: varchar("guaranteed", { length: 255 }).notNull(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id),
    },
    (table) => [index("product_infos_product_id_index").on(table.productId)],
);

export const productSpecificationGroups = pgTable(
    "product_specification_groups",
    {
        ...baseColumns,
        name: varchar("name", { length: 255 }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id),
    },
    (table) => [
        index("product_specification_groups_product_id_index").on(
            table.productId,
        ),
    ],
);

export const specifications = pgTable("specifications", {
    ...baseColumns,
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    productSpecificationGroupId: uuid("product_specification_group_id")
        .notNull()
        .references(() => productSpecificationGroups.id),
});

export const reviews = pgTable(
    "reviews",
    {
        ...baseColumns,
        description: text("description").notNull(),
        rating: integer("rating").notNull(),
        visible: boolean("visible").notNull().default(true),
        publicationDate: date("publication_date").notNull(),
        lastEdited: date("last_edited"),
        userId: uuid("user_id")
            .references(() => users.id)
            .notNull(),
        productId: uuid("product_id")
            .references(() => products.id)
            .notNull(),
    },
    (table) => [
        index("reviews_user_id_index").on(table.userId),
        index("reviews_product_id_index").on(table.productId),
        check("reviews_rating_min_check", sql`${table.rating} >= 1`),
        check("reviews_rating_max_check", sql`${table.rating} <= 5`),
    ],
);

export const wishlists = pgTable(
    "wishlists",
    {
        ...baseColumns,
        productId: uuid("product_id").references(() => products.id),
        userId: uuid("user_id").references(() => users.id),
    },
    (table) => [
        index("wishlists_product_id_index").on(table.productId),
        index("wishlists_user_id_index").on(table.userId),
    ],
);

export const admins = pgTable(
    "admins",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        email: varchar("email", { length: 255 }).notNull(),
        passwordHash: text("password_hash").notNull(),
        authVersion: integer("auth_version").notNull().default(0),
        fullName: varchar("full_name", { length: 255 }).notNull(),
        role: adminRoleEnum("role").notNull().default("admin"),
        mfaEnabled: boolean("mfa_enabled").notNull().default(false),
        mfaSecretEncrypted: text("mfa_secret_encrypted"),
        mfaLastUsedStep: integer("mfa_last_used_step"),
        mfaPendingSecret: text("mfa_pending_secret"),
        mfaPendingExpiresAt: timestamp("mfa_pending_expires_at", {
            withTimezone: true,
        }),
        mfaBackupCodesHash: text("mfa_backup_codes_hash").array(),
        isActive: boolean("is_active").notNull().default(true),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    },
    (table) => [
        uniqueIndex("admins_email_unique_index").on(table.email),
        uniqueIndex("admins_email_lower_unique_index").on(
            sql`lower(${table.email})`,
        ),
        index("admins_role_index").on(table.role),
    ],
);

export const adminPermissions = pgTable(
    "admin_permissions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        adminId: uuid("admin_id")
            .notNull()
            .references(() => admins.id, { onDelete: "cascade" }),
        permission: varchar("permission", { length: 100 }).notNull(),
        grantedAt: timestamp("granted_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        grantedBy: uuid("granted_by").references(() => admins.id, {
            onDelete: "set null",
        }),
    },
    (table) => [
        uniqueIndex("admin_permissions_admin_permission_unique_index").on(
            table.adminId,
            table.permission,
        ),
        index("admin_permissions_admin_id_index").on(table.adminId),
    ],
);

export const adminSessions = pgTable(
    "admin_sessions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        adminId: uuid("admin_id")
            .notNull()
            .references(() => admins.id, { onDelete: "cascade" }),
        tokenHash: varchar("token_hash", { length: 64 }).notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        revokedAt: timestamp("revoked_at", { withTimezone: true }),
        ip: varchar("ip", { length: 64 }),
        userAgent: text("user_agent"),
    },
    (table) => [
        uniqueIndex("admin_sessions_token_hash_unique_index").on(
            table.tokenHash,
        ),
        index("admin_sessions_admin_id_index").on(table.adminId),
        index("admin_sessions_expires_at_index").on(table.expiresAt),
        index("admin_sessions_revoked_at_index").on(table.revokedAt),
    ],
);

export const adminAuditLogs = pgTable(
    "admin_audit_logs",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        adminId: uuid("admin_id").references(() => admins.id, {
            onDelete: "set null",
        }),
        action: auditActionEnum("action").notNull(),
        entity: varchar("entity", { length: 100 }),
        entityId: varchar("entity_id", { length: 100 }),
        ip: varchar("ip", { length: 64 }),
        userAgent: text("user_agent"),
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("admin_audit_logs_admin_id_index").on(table.adminId),
        index("admin_audit_logs_created_at_index").on(table.createdAt),
        index("admin_audit_logs_action_index").on(table.action),
    ],
);

export const loginAttempts = pgTable(
    "login_attempts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        email: varchar("email", { length: 255 }).notNull(),
        ip: varchar("ip", { length: 64 }),
        success: boolean("success").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("login_attempts_email_index").on(table.email),
        index("login_attempts_created_at_index").on(table.createdAt),
    ],
);

export const adminMfaLoginSessions = pgTable(
    "admin_mfa_login_sessions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        adminId: uuid("admin_id")
            .notNull()
            .references(() => admins.id, { onDelete: "cascade" }),
        tokenHash: varchar("token_hash", { length: 64 }).notNull(),
        authVersion: integer("auth_version").notNull().default(0),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        ip: varchar("ip", { length: 64 }),
        userAgent: varchar("user_agent", { length: 512 }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex("admin_mfa_login_sessions_token_hash_unique_index").on(
            table.tokenHash,
        ),
        index("admin_mfa_login_sessions_admin_id_index").on(table.adminId),
        index("admin_mfa_login_sessions_expires_at_index").on(table.expiresAt),
    ],
);

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
    admin: one(admins, {
        fields: [adminSessions.adminId],
        references: [admins.id],
    }),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
    sessions: many(adminSessions),
    permissions: many(adminPermissions),
    auditLogs: many(adminAuditLogs),
}));

export const adminAuditLogsRelations = relations(adminAuditLogs, ({ one }) => ({
    admin: one(admins, {
        fields: [adminAuditLogs.adminId],
        references: [admins.id],
    }),
}));

export const adminPermissionsRelations = relations(
    adminPermissions,
    ({ one }) => ({
        admin: one(admins, {
            fields: [adminPermissions.adminId],
            references: [admins.id],
        }),
    }),
);

export const filesRelations = relations(files, ({ one, many }) => ({
    uploader: one(users, {
        relationName: "userUploads",
        fields: [files.uploaderId],
        references: [users.id],
    }),
    product: one(products, {
        relationName: "productGallery",
        fields: [files.productId],
        references: [products.id],
    }),
    review: one(reviews, {
        fields: [files.reviewId],
        references: [reviews.id],
    }),
    productsAsMainImage: many(products, { relationName: "productMainImage" }),
    productsAsSliderImage: many(products, {
        relationName: "productSliderImage",
    }),
    userAvatars: many(users, { relationName: "userAvatar" }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    avatar: one(files, {
        relationName: "userAvatar",
        fields: [users.avatarId],
        references: [files.id],
    }),
    sessions: many(userSessions),
    carts: many(carts),
    orders: many(orders),
    reviews: many(reviews),
    wishlist: many(wishlists),
    uploadedFiles: many(files, { relationName: "userUploads" }),
    mfaBackupCodes: many(mfaBackupCodes),
    mfaLoginSessions: many(mfaLoginSessions),
    oauthExchangeCodes: many(oauthExchangeCodes),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
    user: one(users, {
        fields: [userSessions.userId],
        references: [users.id],
    }),
}));

export const mfaBackupCodesRelations = relations(mfaBackupCodes, ({ one }) => ({
    user: one(users, {
        fields: [mfaBackupCodes.userId],
        references: [users.id],
    }),
}));

export const mfaLoginSessionsRelations = relations(
    mfaLoginSessions,
    ({ one }) => ({
        user: one(users, {
            fields: [mfaLoginSessions.userId],
            references: [users.id],
        }),
    }),
);

export const oauthExchangeCodesRelations = relations(
    oauthExchangeCodes,
    ({ one }) => ({
        user: one(users, {
            fields: [oauthExchangeCodes.userId],
            references: [users.id],
        }),
    }),
);

export const productsRelations = relations(products, ({ one, many }) => ({
    image: one(files, {
        fields: [products.imageId],
        references: [files.id],
        relationName: "productMainImage",
    }),
    sliderImages: many(files, { relationName: "productGallery" }),
    carts: many(carts),
    productVariants: many(productVariants),
    options: many(options),
    productSpecifications: many(productSpecifications),
    productInfos: many(productInfos),
    productSpecificationGroups: many(productSpecificationGroups),
    reviews: many(reviews),
    wishlist: many(wishlists),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
    product: one(products, {
        fields: [carts.productId],
        references: [products.id],
    }),
    user: one(users, {
        fields: [carts.userId],
        references: [users.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
}));

export const productVariantsRelations = relations(
    productVariants,
    ({ one }) => ({
        product: one(products, {
            fields: [productVariants.productId],
            references: [products.id],
        }),
    }),
);

export const optionsRelations = relations(options, ({ one, many }) => ({
    product: one(products, {
        fields: [options.productId],
        references: [products.id],
    }),
    optionDetails: many(optionDetails),
}));

export const optionDetailsRelations = relations(optionDetails, ({ one }) => ({
    option: one(options, {
        fields: [optionDetails.optionId],
        references: [options.id],
    }),
}));

export const productSpecificationsRelations = relations(
    productSpecifications,
    ({ one }) => ({
        product: one(products, {
            fields: [productSpecifications.productId],
            references: [products.id],
        }),
    }),
);

export const productInfosRelations = relations(productInfos, ({ one }) => ({
    product: one(products, {
        fields: [productInfos.productId],
        references: [products.id],
    }),
}));

export const productSpecificationGroupsRelations = relations(
    productSpecificationGroups,
    ({ one, many }) => ({
        product: one(products, {
            fields: [productSpecificationGroups.productId],
            references: [products.id],
        }),
        specifications: many(specifications),
    }),
);

export const specificationsRelations = relations(specifications, ({ one }) => ({
    productSpecificationGroup: one(productSpecificationGroups, {
        fields: [specifications.productSpecificationGroupId],
        references: [productSpecificationGroups.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
    files: many(files),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
    product: one(products, {
        fields: [wishlists.productId],
        references: [products.id],
    }),
    user: one(users, {
        fields: [wishlists.userId],
        references: [users.id],
    }),
}));

export const adminSettings = pgTable("admin_settings", {
    key: varchar("key", { length: 100 }).primaryKey(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const adminRateLimits = pgTable(
    "admin_rate_limits",
    {
        key: varchar("key", { length: 100 }).primaryKey(),
        count: integer("count").notNull(),
        resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
    },
    (table) => [index("admin_rate_limits_reset_at_index").on(table.resetAt)],
);

export const fileDeletions = pgTable("file_deletions", {
    fileUrl: varchar("file_url", { length: 255 }).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
