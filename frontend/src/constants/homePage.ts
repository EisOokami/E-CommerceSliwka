import type {
    HeroSectionBlock,
    FeatureProductsSectionBlock,
} from "@/interfaces/homePage";

export const heroSection: HeroSectionBlock = {
    id: "hero",
    __component: "layout.hero-section",
    heading: "IPhone 16 Pro",
    subHeading: "Created to change everything for the better. For everyone",
    product: {
        id: "hero-product",
        name: "IPhone 16 Pro",
        slug: "",
    },
    image: {
        id: "hero-image",
        url: "/home-page/iphone_hero_18439b6a82.png",
        alternativeText: "iphone-16-pro",
    },
};

const editorialProducts = [
    {
        heading: "Playstation 5",
        subHeading: "Next-gen gaming console from Sony",
        product: {
            slug: "",
        },
        image: {
            src: "/home-page/vVVviL9q4fhrHWqB4CGMkV-1200-80.jpg",
            alt: "playstation-5",
        },
    },
    {
        heading: "Apple AirPods Max",
        subHeading: "is now available",
        product: {
            slug: "",
        },
        image: {
            src: "/home-page/apple-airpods-max-2024-midnight.png",
            alt: "apple-airpods-max-2024-midnight",
        },
    },
    {
        heading: "Apple Vision Pro",
        subHeading:
            "A groundbreaking spatial computer from Apple that blends virtual and augmented reality, offering a whole new way to experience and interact with digital content.",
        product: {
            slug: "",
        },
        image: {
            src: "/home-page/apple_vision.jpg",
            alt: "apple-vision",
        },
    },
    {
        heading: "Sony Alpha A7 III",
        subHeading:
            "Full-frame mirrorless camera that strikes a perfect balance between performance and versatility, making it an excellent choice for both professionals and enthusiasts",
        product: {
            slug: "",
        },
        image: {
            src: "/home-page/ILCE7KB.RU2-489-600x600.png",
            alt: "sony-alpha-a7-iii",
        },
    },
    {
        heading: "MacBook Air M3",
        subHeading: "New arrivals",
        product: {
            slug: "",
        },
        image: {
            src: "/home-page/IMG_2758.jpg",
            alt: "macbook-air-m3",
        },
    },
];

export const featureProductsSection: FeatureProductsSectionBlock = {
    id: "features",
    __component: "layout.feature-products-section",
    title: "Explore our collection",
    description: "Discover electronics and accessories",
    featureProduct: editorialProducts.map((item, index) => ({
        id: `feature-${index}`,
        heading: item.heading,
        subHeading: item.subHeading,
        product: null,
        image: {
            id: `feature-image-${index}`,
            url: item.image.src,
            alternativeText: item.image.alt,
        },
    })),
};
