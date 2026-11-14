import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { PageItem } from "@/types/types";

export function getAppURL() {
    return (
        process.env.API_URL ??
        process.env.ADMIN_API_ORIGIN ??
        "http://127.0.0.1:3001"
    );
}

export function getAppMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    if (url.startsWith("data:")) {
        return url;
    }

    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    return url.startsWith("/files/") ? "/media" + url : url;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeTime(
    dateInput: Date | string | number,
    lang: string = "en",
): string {
    const date = new Date(dateInput);
    const now = new Date();

    const secondsDelta = Math.round((date.getTime() - now.getTime()) / 1000);

    const cutoffs: { type: Intl.RelativeTimeFormatUnit; value: number }[] = [
        { type: "second", value: 60 },
        { type: "minute", value: 60 },
        { type: "hour", value: 24 },
        { type: "day", value: 7 },
        { type: "week", value: 4.345 },
        { type: "month", value: 12 },
        { type: "year", value: Infinity },
    ];

    let delta = secondsDelta;

    for (const cutoff of cutoffs) {
        if (Math.abs(delta) < cutoff.value) {
            const formatter = new Intl.RelativeTimeFormat(lang, {
                numeric: "always",
            });

            return formatter.format(Math.round(delta), cutoff.type);
        }

        delta /= cutoff.value;
    }

    return date.toLocaleDateString(lang);
}

export function moneyLabel(
    minor: number | string | null,
    currency: string | null,
) {
    if (minor === null || !currency) {
        return "Not recorded";
    }

    try {
        const format = new Intl.NumberFormat("en", {
            style: "currency",
            currency,
        });
        const digits = format.resolvedOptions().maximumFractionDigits ?? 2;

        return format.format(Number(minor) / 10 ** digits);
    } catch {
        return String(minor) + " " + currency;
    }
}

export function mediaUrl(value: string) {
    return value.startsWith("/files/") ? "/media" + value : value;
}

export function getPageItems(page: number, totalPages: number): PageItem[] {
    const visible = Array.from(
        new Set([1, page - 1, page, page + 1, totalPages]),
    )
        .filter((n) => n >= 1 && n <= totalPages)
        .sort((a, b) => a - b);
    const items: PageItem[] = [];

    visible.forEach((n, index) => {
        const prev = visible[index - 1];

        if (index > 0 && n - prev === 2) {
            items.push({ key: "page-" + (n - 1), page: n - 1 });
        }

        if (index > 0 && n - prev > 2) {
            items.push({ key: "gap-" + n, page: null });
        }

        items.push({ key: "page-" + n, page: n });
    });

    return items;
}

export function getInitials(name: string) {
    const parts = name
        .trim()
        .split(/[\s._-]+/)
        .filter(Boolean);
    const letters =
        parts.length > 1 ? parts[0][0] + parts[1][0] : name.trim().slice(0, 2);

    return letters.toUpperCase() || "?";
}

export function hash(value: string) {
    let h = 0;

    for (const char of value) {
        h = (h * 31 + char.charCodeAt(0)) >>> 0;
    }

    return h;
}

export const permissionLabel = (value: string) => {
    return value
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};
