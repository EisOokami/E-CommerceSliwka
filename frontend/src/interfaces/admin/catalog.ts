export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface ManagedReview {
    id: string;
    description: string;
    rating: number;
    visible: boolean;
    productId: string;
    productName: string;
    userId: string;
    userName: string;
    createdAt: string;
}

export interface Coupon {
    id: string;
    code: string;
    kind: "percentage" | "fixed";
    amount: number;
    currency: "usd";
    enabled: boolean;
    expiresAt: string | null;
    usageLimit: number | null;
    minimumMinor: number;
}

export interface ProductImage {
    id: string;
    fileUrl: string;
    filename: string;
    productId?: string | null;
    imageRole?: string | null;
}

export interface ProductRelations {
    galleryIds?: string[];
    productVariants?: {
        name: string;
        hex: string;
        productSlug: string | null;
        inStock: boolean;
    }[];
    options?: {
        title: string;
        optionDetails: {
            name: string;
            productSlug: string | null;
            inStock: boolean;
        }[];
    }[];
    productSpecifications?: {
        name: string;
        specification: string;
        icon: string;
    }[];
    productInfos?: { delivery: string; inStore: string; guaranteed: string }[];
    productSpecificationGroups?: {
        name: string;
        specifications: { name: string; description: string }[];
    }[];
}
