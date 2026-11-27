import type { IGlobalData } from "@/interfaces/globalData";
import type { IAuthPage } from "@/interfaces/authPage";

const link = (id: string, url: string, text: string) => ({
    id,
    url,
    text,
    isExternal: false,
});

const external = (id: string, url: string, text: string) => ({
    ...link(id, url, text),
    isExternal: true,
});

const logo = { id: "brand", url: "/icon.ico", alternativeText: "Sliwka" };

export const storeContent: {
    global: IGlobalData;
    auth: { signIn: IAuthPage; signUp: IAuthPage };
} = {
    global: {
        id: "store",
        createdAt: new Date(0),
        updatedAt: new Date(0),
        title: "E-Commerce Sliwka",
        description: "Electronics and accessories",
        header: {
            id: "header",
            logoImage: logo,
            logoLink: link("home", "/", "Sliwka"),
            navigationLinks: [
                link("home", "/", "Home"),
                link("catalog", "/catalog", "Catalog"),
            ],
            iconsLink: [
                link("wishlist", "/wishlist", "wishlist"),
                link("cart", "/cart", "cart"),
                link("account", "/account", "profile"),
            ],
        },
        footer: {
            id: "footer",
            aboutUs:
                "Sliwka is a demo online store: an open-source portfolio project. Nothing is sold here, orders are never shipped and payments run in Stripe test mode only.",
            logoImage: logo,
            logoLink: link("home", "/", "Sliwka"),
            utilityLinks: [
                {
                    id: "store",
                    title: "Store",
                    links: [
                        link("catalog", "/catalog", "Catalog"),
                        link("cart", "/cart", "Cart"),
                        link("wishlist", "/wishlist", "Wishlist"),
                        link(
                            "order-history",
                            "/account/order-history",
                            "Order history",
                        ),
                    ],
                },
                {
                    id: "legal",
                    title: "About this demo",
                    links: [
                        link("terms", "/terms", "Terms of Service"),
                        link("privacy", "/privacy", "Privacy Policy"),
                        external(
                            "contact",
                            "mailto:help.lakio@gmail.com",
                            "Contact",
                        ),
                        external(
                            "source",
                            "https://github.com/EisOokami/E-CommerceSliwka",
                            "Source code",
                        ),
                    ],
                },
            ],
            socialLinks: [
                external(
                    "github",
                    "https://github.com/EisOokami/E-CommerceSliwka",
                    "GitHub",
                ),
            ],
        },
    },
    auth: {
        signIn: {
            id: "signin",
            createdAt: new Date(0),
            updatedAt: new Date(0),
            link: link("catalog", "/catalog", "Browse products"),
            banner: {
                id: "banner",
                url: "/home-page/iphone_hero_18439b6a82.png",
                alternativeText: "Electronics",
            },
        },
        signUp: {
            id: "signup",
            createdAt: new Date(0),
            updatedAt: new Date(0),
            link: link("catalog", "/catalog", "Browse products"),
            banner: {
                id: "banner",
                url: "/home-page/iphone_hero_18439b6a82.png",
                alternativeText: "Electronics",
            },
        },
    },
};
