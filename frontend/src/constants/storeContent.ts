import type { IGlobalData } from "@/interfaces/globalData";
import type { IAuthPage } from "@/interfaces/authPage";

const link = (id: string, url: string, text: string) => ({
    id,
    url,
    text,
    isExternal: false,
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
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam aperiam, velit saepe cupiditate in alias corrupti repellat rem excepturi. Reprehenderit.",
            logoImage: logo,
            logoLink: link("home", "/", "Sliwka"),
            utilityLinks: [
                {
                    id: "services",
                    title: "Services",
                    links: [
                        link("bonus-program", "#", "Bonus program"),
                        link("gift-cards", "#", "Gift cards"),
                        link("credit", "#", "Credit and payment"),
                        link("service-contracts", "#", "Service contracts"),
                        link("non-cash-account", "#", "Non-cash account"),
                        link("payment", "#", "Payment"),
                    ],
                },
                {
                    id: "buyer-assistance",
                    title: "Assistance to the buyer",
                    links: [
                        link("find-order", "#", "Find an order"),
                        link("delivery", "#", "Terms of delivery"),
                        link("returns", "#", "Exchange and return of goods"),
                        link("guarantee", "#", "Guarantee"),
                        link("faq", "#", "Frequently asked questions"),
                        link("terms-of-use", "#", "Terms of use of the site"),
                    ],
                },
            ],
            socialLinks: [
                link("x", "#", "X"),
                link("bluesky", "#", "Bluesky"),
                link("facebook", "#", "Facebook"),
                link("tiktok", "#", "TikTok"),
                link("instagram", "#", "Instagram"),
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
