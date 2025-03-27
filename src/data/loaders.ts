import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import { IStore } from "./loaders.interfaces";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
    const authToken = null;

    const headers = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    };

    try {
        const response = await fetch(url, authToken ? headers : {});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function getHomePageData() {
    const url = new URL("/api/home-page", baseUrl);

    url.search = qs.stringify({
        populate: {
            blocks: {
                on: {
                    "layout.hero-section": {
                        populate: {
                            image: {
                                fields: ["url", "alternativeText"],
                            },
                            link: {
                                populate: true,
                            },
                        },
                    },
                    "layout.feature-products-section": {
                        populate: {
                            featureproduct: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    link: {
                                        populate: true,
                                    },
                                },
                            },
                        },
                    },
                    "layout.discounts": {
                        populate: {
                            stores: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
                                    },
                                    productInfo: {
                                        populate: true,
                                    },
                                    productSpecs: {
                                        populate: true,
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    detailedSpecifications: {
                                        populate: {
                                            specifications: {
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            avatar: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "layout.products-carousel-section": {
                        populate: {
                            stores: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
                                    },
                                    productInfo: {
                                        populate: true,
                                    },
                                    productSpecs: {
                                        populate: true,
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    detailedSpecifications: {
                                        populate: {
                                            specifications: {
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            avatar: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "layout.products-section": {
                        populate: {
                            categories: {
                                populate: true,
                            },
                            tabs: {
                                populate: true,
                            },
                            newArrival: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
                                    },
                                    productInfo: {
                                        populate: true,
                                    },
                                    productSpecs: {
                                        populate: true,
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    detailedSpecifications: {
                                        populate: {
                                            specifications: {
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            avatar: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                            bestseller: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
                                    },
                                    productInfo: {
                                        populate: true,
                                    },
                                    productSpecs: {
                                        populate: true,
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    detailedSpecifications: {
                                        populate: {
                                            specifications: {
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            avatar: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                            featuredProducts: {
                                populate: {
                                    image: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    sliderImages: {
                                        fields: ["url", "alternativeText"],
                                    },
                                    colors: {
                                        populate: true,
                                    },
                                    options: {
                                        populate: true,
                                    },
                                    productInfo: {
                                        populate: true,
                                    },
                                    productSpecs: {
                                        populate: true,
                                    },
                                    category: {
                                        populate: true,
                                    },
                                    detailedSpecifications: {
                                        populate: {
                                            specifications: {
                                                populate: true,
                                            },
                                        },
                                    },
                                    reviews: {
                                        populate: {
                                            avatar: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                            images: {
                                                fields: [
                                                    "url",
                                                    "alternativeText",
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return await fetchData(url.href);
}

export async function getGlobalData() {
    const url = new URL("/api/global", baseUrl);

    url.search = qs.stringify({
        populate: {
            header: {
                populate: [
                    "logoLink",
                    "navigationLinks",
                    "iconsLink",
                    "logoImage",
                ],
            },
            footer: {
                populate: {
                    logoLink: true,
                    socialLinks: true,
                    utilityLinks: {
                        populate: "links",
                    },
                    logoImage: true,
                },
            },
        },
    });

    return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
    const url = new URL("/api/global", baseUrl);

    url.search = qs.stringify({
        fields: ["title", "description"],
    });

    return await fetchData(url.href);
}

export async function getStoreProductsData() {
    const url = new URL("/api/stores", baseUrl);

    url.search = qs.stringify({
        populate: {
            image: {
                fields: ["url", "alternativeText"],
            },
            sliderImages: {
                fields: ["url", "alternativeText"],
            },
            colors: {
                populate: true,
            },
            options: {
                populate: true,
            },
            productInfo: {
                populate: true,
            },
            productSpecs: {
                populate: true,
            },
            category: {
                populate: true,
            },
            detailedSpecifications: {
                populate: {
                    specifications: {
                        populate: {
                            specifications: {
                                populate: true,
                            },
                        },
                    },
                },
            },
            reviews: {
                populate: {
                    avatar: {
                        fields: ["url", "alternativeText"],
                    },
                    images: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data;
}

export async function getStoreProductData(id: number) {
    const url = new URL("/api/stores", baseUrl);

    url.search = qs.stringify({
        populate: {
            image: {
                fields: ["url", "alternativeText"],
            },
            sliderImages: {
                fields: ["url", "alternativeText"],
            },
            colors: {
                populate: true,
            },
            options: {
                populate: true,
            },
            productInfo: {
                populate: true,
            },
            productSpecs: {
                populate: true,
            },
            category: {
                populate: true,
            },
            detailedSpecifications: {
                populate: {
                    specifications: {
                        populate: {
                            specifications: {
                                populate: true,
                            },
                        },
                    },
                },
            },
            reviews: {
                populate: {
                    avatar: {
                        fields: ["url", "alternativeText"],
                    },
                    images: {
                        fields: ["url", "alternativeText"],
                    },
                },
            },
        },
    });

    const fetchedData = await fetchData(url.href);

    return fetchedData.data.find((product: IStore) => product.id === id);
}
