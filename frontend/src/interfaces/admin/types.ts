import { Visibility } from "@/types/types";

export interface OptionDetailDraft {
    name: string;
    productSlug: string;
    inStock: boolean;
}

export interface OptionDraft {
    title: string;
    details: OptionDetailDraft[];
}

export interface SpecificationDraft {
    name: string;
    description: string;
}

export interface ProductSpecificationGroupDraft {
    name: string;
    specifications: SpecificationDraft[];
}

export interface ProductSpecificationDraft {
    name: string;
    specification: string;
    icon: string;
}

export interface ProductVariantDraft {
    name: string;
    hex: string;
    inStock: boolean;
}

export interface ProductInfoDraft {
    delivery: string;
    inStore: string;
    guaranteed: string;
}

export interface CreateProductFormData {
    mainImage: File | null;
    sliderImages: File[];
    productVariants: ProductVariantDraft[];
    options: OptionDraft[];
    productSpecifications: ProductSpecificationDraft[];
    productInfo: ProductInfoDraft;
    productSpecificationGroups: ProductSpecificationGroupDraft[];
    price: string;
    isDiscount: boolean;
    discountedPrice: string;
    finalPrice: string;
    slug: string;
    category: string;
    quantity: string;
    color: string;
    inStock: boolean;
    visibility: Visibility;
}
