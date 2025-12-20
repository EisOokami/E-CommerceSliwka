import {
    BaseSchema,
    BlockBase,
    IArray,
    ICategory,
    IImage,
    IProduct,
} from "./interfaces";

export interface HeroSectionBlock extends BlockBase<"layout.hero-section"> {
    heading: string;
    subHeading: string;
    image: IImage;
    product: Pick<IProduct, "documentId" | "id" | "name" | "slug">;
}

export interface FeatureProduct extends Pick<BaseSchema, "id"> {
    heading: string;
    subHeading: string;
    image: IImage;
    product: Pick<IProduct, "documentId" | "id" | "slug"> | null;
}

export interface FeatureProductsSectionBlock
    extends BlockBase<"layout.feature-products-section"> {
    title: string;
    description: string;
    featureProduct: FeatureProduct[];
}

export interface ProductsSectionBlock
    extends BlockBase<"layout.products-section"> {
    tabs: IArray[];
    categories: ICategory[];
    featuredProducts: IProduct[];
    bestseller: IProduct[];
    newArrival: IProduct[];
}

export interface ProductsCarouselSectionBlock
    extends BlockBase<"layout.products-carousel-section"> {
    products: IProduct[];
}

export interface DiscountsSectionBlock extends BlockBase<"layout.discounts"> {
    products: IProduct[];
}

export interface IHomePage extends BaseSchema {
    title: string;
    description: string;
    blocks: [
        HeroSectionBlock,
        FeatureProductsSectionBlock,
        ProductsSectionBlock,
        ProductsCarouselSectionBlock,
        DiscountsSectionBlock,
    ];
}
