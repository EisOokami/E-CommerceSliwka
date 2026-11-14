import { OrderStatus } from "@/types/types";
import type { ProductRelations, ProductImage } from "./catalog";
export type { ProductInput, OrderStatus } from "@/types/types";

export interface AdminIdentity {
    id: string;
    email: string;
    fullName: string;
    role: string;
    permissions: string[];
    mfaEnabled: boolean;
}

export interface Reauthentication {
    password: string;
    code?: string;
}

export interface Session {
    id: string;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
    lastActivityAt: string;
    expiresAt: string;
    current?: boolean;
}

export interface AuditEvent {
    id: string;
    action: string;
    entity: string | null;
    entityId: string | null;
    ip: string | null;
    createdAt: string;
}

export interface Product extends ProductRelations {
    image?: ProductImage;
    sliderImages?: ProductImage[];
    id: string;
    name: string;
    description: string;
    imageId: string;
    slug: string;
    category: string;
    price: string;
    discountedPrice: string | null;
    finalPrice: string | null;
    quantity: number;
    color: string;
    visibility: "visible" | "draft" | "hidden";
    isDiscount: boolean;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface File {
    id: string;
    fileUrl: string;
    filename: string;
    imageRole?: string | null;
}

export interface Customer {
    id: string;
    username: string;
    email: string;
    blocked: boolean;
    confirmed: boolean;
    createdAt: string;
    ordersCount: number;
    avatar: Pick<File, "fileUrl">;
}

export interface Order {
    id: string;
    orderId: string;
    userId: string;
    customerEmail?: string;
    customer?: Customer;
    totalMinor: number | null;
    currency: string | null;
    deliveryStatus: OrderStatus;
    isSuccess: boolean;
    createdAt: string;
    trackingNumber: string | null;
    cartItems: { id: string; quantity: number; product: { id: string } }[];
}

export interface AdminAccount extends Omit<AdminIdentity, "permissions"> {
    permissions?: string[];
    isActive: boolean;
    createdAt: string;
    lastLoginAt: string | null;
    sessions?: Session[];
}

export interface AdminInput {
    fullName: string;
    role: "admin" | "manager" | "support";
    permissions: string[];
    isActive: boolean;
    email?: string;
    password?: string;
}

export interface Collection<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface StoreSettings {
    storeName: string;
    lowStockThreshold: number;
}

export interface Dashboard {
    products: number;
    orders: number;
    customers: number;
    missingTotals: number;
    revenue: { currency: string | null; totalMinor: string }[];
    chart: {
        date: string;
        currency: string | null;
        totalMinor: string | null;
    }[];
    recentOrders: Order[];
    lowStock: Product[];
}

export const permissions = [
    "categories.read",
    "categories.create",
    "categories.update",
    "categories.delete",
    "reviews.read",
    "reviews.update",
    "reviews.delete",
    "coupons.read",
    "coupons.create",
    "coupons.update",
    "coupons.delete",
    "products.read",
    "products.create",
    "products.update",
    "products.delete",
    "orders.read",
    "orders.update",
    "orders.refund",
    "users.read",
    "users.update",
    "users.delete",
    "admins.read",
    "admins.manage",
    "settings.read",
    "settings.update",
] as const;
