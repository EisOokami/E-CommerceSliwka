import { AutofillDetails } from "@/types/types";

export interface GenerateDescriptionInput {
    name: string;
    brand?: string;
    category?: string;
    specifications?: Record<string, string>;
    currentDescription?: string;
}

export interface GeneratedDescription {
    description: string;
}

export interface AutofillProductInput {
    name: string;
    description?: string;
    category?: string;
    specifications?: Record<string, string>;
    additionalInformation?: string;
    existingDetails?: AutofillDetails;
}

export interface ProductSuggestions extends AutofillDetails {
    name?: string;
    description?: string;
    slug?: string;
    category?: string;
    productSpecifications?: {
        name: string;
        specification: string;
        icon: string;
    }[];
}
