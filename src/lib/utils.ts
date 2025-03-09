export function getStrapiURL() {
    return process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.NEXT_PUBLIC_DB_URL;
}

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    if (url.startsWith("data:")) {
        return url;
    }

    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    return `${getStrapiURL()}${url}`;
}
