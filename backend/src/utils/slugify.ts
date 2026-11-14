import slugifyLib from "slugify";

export function generateSlug(name: string): string {
    return slugifyLib(name, {
        lower: true,
        strict: true,
        trim: true,
    });
}

export function generateUniqueSlug(
    base: string,
    existingSlugs: Set<string>,
): string {
    let slug = base;
    let counter = 2;

    while (existingSlugs.has(slug)) {
        slug = `${base}-${counter}`;
        counter++;
    }

    return slug;
}
