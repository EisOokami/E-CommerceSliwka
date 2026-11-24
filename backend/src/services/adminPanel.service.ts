import { and, asc, count, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import {
    adminPermissions,
    adminSettings,
    admins,
    orders,
    products,
    userSessions,
    users,
} from "../db/schema.js";
import { type DatabaseTransaction } from "../types/database.js";
import { type IAdminRequest } from "../types/types.js";
import { ApiError } from "../utils/apiError.js";
import { hashPassword } from "../utils/auth/adminPassword.js";
import {
    adminCreateSchema,
    adminUpdateSchema,
    listSchema,
    orderSchema,
    productSchema,
    settingsSchema,
    userSchema,
    type ListInput,
    type Resource,
} from "../validators/adminPanel.js";
import * as accountErasureService from "./accountErasure.service.js";
import * as adminAuthService from "./adminAuth.service.js";
import * as adminBootstrapService from "./adminBootstrap.service.js";
import * as adminMfaLoginSessionService from "./adminMfaLoginSession.service.js";
import * as adminProductsService from "./adminProducts.service.js";
import * as auditService from "./audit.service.js";
import * as sessionService from "./session.service.js";

export const detail = async (resource: Resource, id: string) => {
    if (resource === "products") {
        const product = await adminProductsService.productDetail(id);

        if (!product) {
            throw new ApiError({
                statusCode: 404,
                message: "Product detail not found",
            });
        }

        return product;
    }

    const result = await list(resource, listSchema.parse({}), id);
    const row = result.data[0];

    if (!row) {
        throw new ApiError({ statusCode: 404, message: "List data not found" });
    }

    if (resource === "admins") {
        const permissions = (
            await db
                .select({ permission: adminPermissions.permission })
                .from(adminPermissions)
                .where(eq(adminPermissions.adminId, id))
        ).map((row) => row.permission);

        return {
            ...row,
            permissions: permissions,
            sessions: await sessionService.listSessions(id),
        };
    }

    if (resource === "orders") {
        const [customerForOrder] = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                blocked: users.blocked,
                confirmed: users.confirmed,
                createdAt: users.createdAt,
                ordersCount: sql<number>`(select count(*)::int from orders where orders.user_id = ${users.id})`,
            })
            .from(users)
            .innerJoin(orders, eq(orders.userId, users.id))
            .where(eq(orders.id, id));

        return { ...row, customer: customerForOrder };
    }

    return row;
};

export const authorize = async (
    tx: DatabaseTransaction,
    req: IAdminRequest,
    permission: string,
    sensitive: boolean,
) => {
    if (!req.admin) {
        throw new ApiError({ statusCode: 401, message: "Unauthorized" });
    }

    const lockedAdmin = await adminAuthService.lockAdmin({
        client: tx,
        id: req.admin.id,
    });

    if (
        !lockedAdmin ||
        !lockedAdmin.isActive ||
        !(await sessionService.lockActiveSession(
            tx,
            lockedAdmin.id,
            req.adminSession!.id,
        ))
    ) {
        throw new ApiError({ statusCode: 401, message: "Unauthorized" });
    }

    if (
        sensitive &&
        (req.adminStepUpVersion === undefined ||
            req.adminStepUpVersion !== lockedAdmin.authVersion)
    ) {
        throw new ApiError({ statusCode: 403, message: "STEP_UP_REQUIRED" });
    }

    if (
        lockedAdmin.role !== "super_admin" &&
        !(
            await sessionService.adminPermissionsFor(tx, lockedAdmin.id)
        ).includes(permission)
    ) {
        throw new ApiError({ statusCode: 403, message: "Forbidden" });
    }

    return lockedAdmin;
};

export const mutate = async (
    resource: Resource,
    operation: "create" | "update" | "delete",
    id: string | undefined,
    body: unknown,
    req: IAdminRequest,
) => {
    const validateData =
        operation === "delete"
            ? undefined
            : resource === "products"
              ? productSchema.parse(body)
              : resource === "orders"
                ? orderSchema.parse(body)
                : resource === "users"
                  ? userSchema.parse(body)
                  : operation === "create"
                    ? adminCreateSchema.parse(body)
                    : adminUpdateSchema.parse(body);
    const passwordHash =
        resource === "admins" && operation === "create"
            ? await hashPassword(adminCreateSchema.parse(body).password)
            : undefined;
    const openCheckoutSessions: string[] = [];

    const result = await db.transaction(async (tx) => {
        const permission =
            resource === "admins"
                ? "admins.manage"
                : resource + "." + operation;
        const actor = await authorize(
            tx,
            req,
            permission,
            resource === "admins" || operation === "delete",
        );

        let entityId = id;

        switch (resource) {
            case "admins": {
                if (actor.role !== "super_admin") {
                    throw new ApiError({
                        statusCode: 403,
                        message: "Super admin required",
                    });
                }

                const target = id
                    ? await adminAuthService.lockAdmin({ client: tx, id: id })
                    : undefined;

                if (id && !target) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Admin not found",
                    });
                }

                if (
                    (target && target.role === "super_admin") ||
                    id === actor.id
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message:
                            "The bootstrap super admin cannot be changed here",
                    });
                }

                if (operation === "delete" && id) {
                    await tx.delete(admins).where(eq(admins.id, id));
                }

                if (operation === "create" && id && passwordHash) {
                    const input = adminCreateSchema.parse(validateData);

                    const createdAdminId = (
                        await adminBootstrapService.createAdmin(tx, {
                            email: input.email,
                            fullName: input.fullName,
                            role: input.role,
                            passwordHash: passwordHash,
                        })
                    ).id;

                    entityId = createdAdminId;

                    const permission = [...new Set(input.permissions)];

                    await tx
                        .delete(adminPermissions)
                        .where(eq(adminPermissions.adminId, entityId));

                    if (permission.length) {
                        await tx.insert(adminPermissions).values(
                            permission.map((permission) => ({
                                adminId: createdAdminId,
                                permission,
                                grantedBy: actor.id,
                            })),
                        );
                    }
                }

                if (operation === "update" && id && target) {
                    const input = adminUpdateSchema.parse(validateData);
                    const update = adminUpdateSchema.parse(input);

                    await adminAuthService.updateAdmin({
                        client: tx,
                        id: id,
                        values: {
                            fullName: update.fullName,
                            role: update.role,
                            isActive: update.isActive,
                            authVersion: target.authVersion + 1,
                            updatedAt: new Date(),
                        },
                    });
                    await sessionService.revokeAdminSessions(tx, id);
                    await adminMfaLoginSessionService.invalidateChallenges(
                        tx,
                        id,
                    );

                    const permission = [...new Set(input.permissions)];

                    await tx
                        .delete(adminPermissions)
                        .where(eq(adminPermissions.adminId, id));

                    if (permission.length) {
                        await tx.insert(adminPermissions).values(
                            permission.map((permission) => ({
                                adminId: id,
                                permission,
                                grantedBy: actor.id,
                            })),
                        );
                    }
                }

                break;
            }
            case "products":
                entityId = await adminProductsService.mutateProduct(
                    tx,
                    operation,
                    id,
                    validateData,
                );

                break;
            case "orders": {
                const input = orderSchema.parse(validateData);

                let order = undefined;

                if (id) {
                    order = (
                        await tx
                            .select()
                            .from(orders)
                            .where(eq(orders.id, id))
                            .for("update")
                    )[0];
                }

                if (id && !order) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "Order not found",
                    });
                }

                if (order && order.stockReserved) {
                    throw new ApiError({
                        statusCode: 409,
                        message:
                            "Checkout payment is pending. Wait for settlement or expiration before changing this order.",
                    });
                }

                const allowed = {
                    Processing: ["Processing", "Shipped", "Cancelled"],
                    Shipped: ["Shipped", "Delivered"],
                    Delivered: ["Delivered"],
                    Cancelled: ["Cancelled"],
                };

                if (
                    order &&
                    !allowed[order.deliveryStatus ?? "Processing"].includes(
                        input.deliveryStatus,
                    )
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Invalid order status transition",
                    });
                }

                if (
                    order &&
                    !order.isSuccess &&
                    input.deliveryStatus !== "Cancelled"
                ) {
                    throw new ApiError({
                        statusCode: 409,
                        message: "Unpaid orders cannot be fulfilled",
                    });
                }

                if (id) {
                    await tx
                        .update(orders)
                        .set({ ...input, updatedAt: new Date() })
                        .where(eq(orders.id, id));
                }

                break;
            }
            case "users": {
                let user = undefined;

                if (operation === "update" && id) {
                    const validateUserData = userSchema.parse(validateData);

                    const [userData] = await tx
                        .update(users)
                        .set({
                            ...validateUserData,
                            updatedAt: new Date(),
                        })
                        .where(eq(users.id, id))
                        .returning({ id: users.id });

                    if (validateUserData.blocked) {
                        await tx
                            .update(userSessions)
                            .set({ revoked: true })
                            .where(eq(userSessions.userId, id));
                    }

                    user = userData;
                }

                if (operation === "delete" && id) {
                    const erased = await accountErasureService.eraseUser(
                        tx,
                        id,
                    );

                    if (erased) {
                        user = { id };
                        openCheckoutSessions.push(
                            ...erased.openCheckoutSessions,
                        );
                    }
                }

                if (!user) {
                    throw new ApiError({
                        statusCode: 404,
                        message: "User not found",
                    });
                }

                break;
            }
        }

        const action =
            resource === "admins"
                ? operation === "create"
                    ? "ADMIN_CREATED"
                    : operation === "delete"
                      ? "ADMIN_DELETED"
                      : "PERMISSION_CHANGED"
                : resource === "products"
                  ? operation === "create"
                      ? "PRODUCT_CREATED"
                      : operation === "delete"
                        ? "PRODUCT_DELETED"
                        : "PRODUCT_UPDATED"
                  : resource === "orders"
                    ? "ORDER_UPDATED"
                    : operation === "delete"
                      ? "USER_DELETED"
                      : "USER_UPDATED";

        await auditService.insertAudit(tx, {
            adminId: actor.id,
            action,
            entity: resource,
            entityId,
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });

        return { id: entityId, success: true };
    });

    if (openCheckoutSessions.length) {
        await accountErasureService.expireCheckoutSessions(
            openCheckoutSessions,
        );
    }

    return result;
};

export const settings = async () => {
    const [adminSettingsData] = await db.query.adminSettings.findMany({
        where: eq(adminSettings.key, "store"),
    });

    return (
        adminSettingsData?.value ?? {
            storeName: "Sliwka",
            lowStockThreshold: 5,
        }
    );
};

export const updateSettings = async (body: unknown, req: IAdminRequest) => {
    const value = settingsSchema.parse(body);

    await db.transaction(async (tx) => {
        const actor = await authorize(tx, req, "settings.update", true);

        await tx
            .insert(adminSettings)
            .values({ key: "store", value })
            .onConflictDoUpdate({
                target: adminSettings.key,
                set: { value, updatedAt: new Date() },
            });

        await auditService.insertAudit(tx, {
            adminId: actor.id,
            action: "SETTINGS_UPDATED",
            entity: "settings",
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });
    });

    return value;
};

export const revokeAdminSession = async (
    adminId: string,
    sessionId: string,
    req: IAdminRequest,
) => {
    await db.transaction(async (tx) => {
        const actor = await authorize(tx, req, "admins.manage", true);

        if (actor.role !== "super_admin") {
            throw new ApiError({
                statusCode: 403,
                message: "Super admin required",
            });
        }

        const target = await adminAuthService.lockAdmin({
            client: tx,
            id: adminId,
        });

        if (
            !target ||
            !(await sessionService.revokeStoredAdminSession(
                tx,
                adminId,
                sessionId,
            ))
        ) {
            throw new ApiError({ statusCode: 404, message: "Admin not found" });
        }

        await auditService.insertAudit(tx, {
            adminId: actor.id,
            action: "SESSION_REVOKED",
            entity: "admins",
            entityId: adminId,
            metadata: { sessionId },
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });
    });
};

export const list = async (
    resource: Resource,
    input: ListInput,
    id?: string,
) => {
    const table = { products, orders, users, admins }[resource];

    const name =
        resource === "products"
            ? products.name
            : resource === "orders"
              ? orders.orderId
              : resource === "users"
                ? users.email
                : admins.email;

    const filters: (SQL | undefined)[] = [
        id ? eq(table.id, id) : undefined,
        input.search
            ? ilike(name, `%${input.search.replace(/[\\%_]/g, "\\$&")}%`)
            : undefined,
    ];

    if (input.status) {
        switch (resource) {
            case "products":
                filters.push(
                    sql`${products.visibility}::text = ${input.status}`,
                );
                break;

            case "orders":
                filters.push(
                    sql`${orders.deliveryStatus}::text = ${input.status}`,
                );
                break;

            case "users":
                filters.push(eq(users.blocked, input.status === "blocked"));
                break;

            case "admins":
                filters.push(eq(admins.isActive, input.status === "active"));
                break;
        }
    }

    const where = and(...filters);

    const column =
        input.sort === "name"
            ? name
            : input.sort === "price" && resource === "products"
              ? products.price
              : table.createdAt;

    const order = input.direction === "asc" ? asc(column) : desc(column);

    const options = {
        where,
        orderBy: [order, asc(table.id)],
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
    };

    let rows;

    switch (resource) {
        case "products":
            rows = await db.query.products.findMany({
                ...options,
                with: {
                    image: true,
                },
            });

            break;
        case "orders":
            rows = await db.query.orders.findMany({
                ...options,
                extras: {
                    customerEmail: sql<string | null>`(
                        ${db
                            .select({ email: users.email })
                            .from(users)
                            .where(eq(users.id, orders.userId))
                            .limit(1)}
                    )`.as("customer_email"),
                },
            });

            break;
        case "users":
            rows = await db.query.users.findMany({
                ...options,
                columns: {
                    id: true,
                    username: true,
                    email: true,
                    blocked: true,
                    confirmed: true,
                    createdAt: true,
                },
                with: {
                    avatar: {
                        columns: { fileUrl: true },
                    },
                },
                extras: {
                    ordersCount: sql<number>`(
                ${db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(orders)
                    .where(eq(orders.userId, users.id))}
            )`.as("orders_count"),
                },
            });

            break;
        case "admins":
            rows = await db.query.admins.findMany({
                ...options,
                columns: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    mfaEnabled: true,
                    createdAt: true,
                    lastLoginAt: true,
                },
            });

            break;
    }

    const total = await db.$count(table, where);

    return {
        data: rows,
        total,
        page: input.page,
        pageSize: input.pageSize,
    };
};

export const dashboard = async () => {
    const [
        productCount,
        orderCount,
        userCount,
        revenue,
        chart,
        recentOrders,
        lowStock,
        missingTotals,
    ] = await Promise.all([
        db.select({ value: count() }).from(products),
        db.select({ value: count() }).from(orders),
        db.select({ value: count() }).from(users),
        db
            .select({
                currency: orders.currency,
                totalMinor: sql<string>`coalesce(sum(${orders.totalMinor}), 0)::text`,
            })
            .from(orders)
            .where(eq(orders.isSuccess, true))
            .groupBy(orders.currency),
        db
            .select({
                date: sql<string>`to_char(${orders.createdAt} at time zone 'UTC', 'YYYY-MM-DD')`,
                currency: orders.currency,
                totalMinor: sql<string>`sum(${orders.totalMinor})::text`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.isSuccess, true),
                    sql`${orders.createdAt} > now() - interval '30 days'`,
                ),
            )
            .groupBy(sql`1, 2`)
            .orderBy(sql`1`),
        db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
        db
            .select()
            .from(products)
            .where(
                sql`${products.quantity} <= coalesce((select (value->>'lowStockThreshold')::int from admin_settings where key = 'store'), 5)`,
            )
            .orderBy(asc(products.quantity))
            .limit(10),
        db
            .select({ value: count() })
            .from(orders)
            .where(
                and(
                    eq(orders.isSuccess, true),
                    sql`${orders.totalMinor} is null`,
                ),
            ),
    ]);

    return {
        products: productCount[0] ? productCount[0].value : 0,
        orders: orderCount[0] ? orderCount[0].value : 0,
        customers: userCount[0] ? userCount[0].value : 0,
        revenue,
        chart,
        recentOrders,
        lowStock,
        missingTotals: missingTotals[0] ? missingTotals[0].value : 0,
    };
};

export const customerCanAuthenticate = async (id: string) => {
    const [row] = await db.query.users.findMany({
        columns: {
            blocked: true,
        },
        where: eq(users.id, id),
    });

    return !!row && !row.blocked;
};
