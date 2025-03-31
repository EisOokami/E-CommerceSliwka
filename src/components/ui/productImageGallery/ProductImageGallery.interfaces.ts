export interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
}

export interface ProductImageGalleryProps {
    images: Image[];
}
