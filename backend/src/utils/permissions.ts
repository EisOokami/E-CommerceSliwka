export const permissions = {
    CATEGORIES_READ: "categories.read",
    CATEGORIES_CREATE: "categories.create",
    CATEGORIES_UPDATE: "categories.update",
    CATEGORIES_DELETE: "categories.delete",
    REVIEWS_READ: "reviews.read",
    REVIEWS_UPDATE: "reviews.update",
    REVIEWS_DELETE: "reviews.delete",
    COUPONS_READ: "coupons.read",
    COUPONS_CREATE: "coupons.create",
    COUPONS_UPDATE: "coupons.update",
    COUPONS_DELETE: "coupons.delete",
    PRODUCTS_READ: "products.read",
    PRODUCTS_CREATE: "products.create",
    PRODUCTS_UPDATE: "products.update",
    PRODUCTS_DELETE: "products.delete",

    ORDERS_READ: "orders.read",
    ORDERS_UPDATE: "orders.update",
    ORDERS_REFUND: "orders.refund",

    USERS_READ: "users.read",
    USERS_UPDATE: "users.update",
    USERS_DELETE: "users.delete",

    ADMINS_READ: "admins.read",
    ADMINS_MANAGE: "admins.manage",

    SETTINGS_READ: "settings.read",
    SETTINGS_UPDATE: "settings.update",
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];

export const allPermissions: Permission[] = Object.values(permissions);

export const roleImplicitPermissions: Record<string, Permission[] | "ALL"> = {
    super_admin: "ALL",
    admin: [],
    manager: [],
    support: [],
};
