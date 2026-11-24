import type { ReactNode } from "react";
import { LegalDocumentProps } from "./LegalDocument.interfaces";

export const legalInfo = {
    termsVersion: process.env.TERMS_VERSION || "1.0",
    lastTermsUpdated:
        process.env.LEGAL_LAST_TERMS_UPDATED ||
        "[DO UZUPEŁNIENIA: data ostatniej aktualizacji Regulaminu]",
    effectiveTermsDate:
        process.env.LEGAL_EFFECTIVE_TERMS_DATE ||
        "[DO UZUPEŁNIENIA: data wejścia w życie Regulaminu]",
    privacyVersion: process.env.PRIVACY_VERSION || "1.0",
    lastPrivacyUpdated:
        process.env.LEGAL_LAST_PRIVACY_UPDATED ||
        "[DO UZUPEŁNIENIA: data ostatniej aktualizacji Polityki prywatności]",
    effectivePrivacyDate:
        process.env.LEGAL_EFFECTIVE_PRIVACY_DATE ||
        "[DO UZUPEŁNIENIA: data wejścia w życie Polityki prywatności]",
    operator:
        process.env.LEGAL_OPERATOR ||
        "[DO UZUPEŁNIENIA: pełna nazwa operatora serwisu]",
    contactEmail:
        process.env.LEGAL_CONTACT_EMAIL ||
        "[DO UZUPEŁNIENIA: adres e-mail do kontaktu w sprawach prawnych i ochrony danych osobowych]",
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ?? "[DO UZUPEŁNIENIA: domena serwisu]",
    serverProvider:
        process.env.LEGAL_SERVER_PROVIDER ??
        "[DO UZUPEŁNIENIA: dostawca serwera w UE i kraj]",
    backups:
        process.env.LEGAL_BACKUP_RETENTION ??
        "[DO UZUPEŁNIENIA: okres przechowywania kopii zapasowych, np. do 30 dni]",
    stripeEntity:
        process.env.LEGAL_STRIPE_ENTITY ??
        "Stripe " +
            "[DO UZUPEŁNIENIA: podmiot umowy z panelu Stripe (Settings -> Business), np. Stripe Payments Europe Ltd., Irlandia]",
    repositoryUrl:
        process.env.LEGAL_REPOSITORY_URL ||
        "https://github.com/EisOokami/ECommerceSliwka",
    licenseUrl:
        process.env.LEGAL_LICENSE_URL ||
        `${
            process.env.LEGAL_REPOSITORY_URL ||
            "https://github.com/EisOokami/ECommerceSliwka"
        }/blob/main/LICENSE`,
} as const;

function renderInline(text: string): ReactNode[] {
    const nodes: ReactNode[] = [];

    let last = 0;

    for (const match of text.matchAll(
        /(\*\*[^*]+\*\*|`[^`]+`|\[DO UZUPEŁNIENIA:[^\]]*\]|https?:\/\/[^\s)]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
    )) {
        const index = match.index ?? 0;

        let token = match[0];
        let trailing = "";

        if (index > last) {
            nodes.push(text.slice(last, index));
        }

        if (token.startsWith("**")) {
            nodes.push(
                <strong key={index}>{renderInline(token.slice(2, -2))}</strong>,
            );
        } else if (token.startsWith("`")) {
            nodes.push(
                <code key={index} className="px-1 bg-gray-100 rounded">
                    {token.slice(1, -1)}
                </code>,
            );
        } else if (token.startsWith("[DO UZUPEŁNIENIA")) {
            nodes.push(
                <mark key={index} className="px-1 bg-amber-200">
                    {token}
                </mark>,
            );
        } else if (token.startsWith("http")) {
            const punctuation = /[.,;:]+$/.exec(token);

            if (punctuation) {
                trailing = punctuation[0];
                token = token.slice(0, -trailing.length);
            }

            nodes.push(
                <a
                    key={index}
                    href={token}
                    className="underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {token}
                </a>,
            );
        } else {
            nodes.push(
                <a key={index} href={"mailto:" + token} className="underline">
                    {token}
                </a>,
            );
        }

        if (trailing) {
            nodes.push(trailing);
        }

        last = index + match[0].length;
    }

    if (last < text.length) {
        nodes.push(text.slice(last));
    }

    return nodes;
}

function renderBlocks(source: string): ReactNode[] {
    const lines = source
        .replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
            return key in legalInfo
                ? String(legalInfo[key as keyof typeof legalInfo])
                : match;
        })
        .trim()
        .split("\n");
    const blocks: ReactNode[] = [];

    let i = 0;

    const collect = (test: (line: string) => boolean) => {
        const items: string[] = [];

        while (i < lines.length && test(lines[i])) {
            items.push(lines[i]);

            i++;
        }

        return items;
    };

    while (i < lines.length) {
        const line = lines[i];
        const key = blocks.length;

        if (!line.trim()) {
            i++;

            continue;
        }

        if (line.startsWith("# ")) {
            blocks.push(
                <h1
                    key={key}
                    className="text-3xl md:text-4xl xl:text-5xl font-bold text-pretty"
                >
                    {renderInline(line.slice(2))}
                </h1>,
            );

            i++;

            continue;
        }

        if (line.startsWith("## ")) {
            blocks.push(
                <h2
                    key={key}
                    className="mt-6 text-2xl md:text-3xl font-semibold text-pretty"
                >
                    {renderInline(line.slice(3))}
                </h2>,
            );

            i++;

            continue;
        }

        if (line.startsWith("### ")) {
            blocks.push(
                <h3 key={key} className="mt-2 text-xl md:text-2xl font-medium">
                    {renderInline(line.slice(4))}
                </h3>,
            );

            i++;

            continue;
        }

        if (/^---\s*$/.test(line)) {
            blocks.push(<hr key={key} className="my-4" />);

            i++;

            continue;
        }

        if (line.startsWith("> ")) {
            const quote = collect((current) => current.startsWith("> "));

            blocks.push(
                <blockquote
                    key={key}
                    className="p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl"
                >
                    {renderInline(
                        quote.map((current) => current.slice(2)).join(" "),
                    )}
                </blockquote>,
            );

            continue;
        }

        if (line.startsWith("|")) {
            const rows = collect((current) => current.startsWith("|"))
                .filter((row) => !/^\|[\s:|-]+\|?\s*$/.test(row))
                .map((line) =>
                    line
                        .trim()
                        .replace(/^\|/, "")
                        .replace(/\|$/, "")
                        .split("|")
                        .map((cell) => cell.trim()),
                );
            const [head, ...body] = rows;

            blocks.push(
                <div key={key} className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                {head.map((cell, index) => (
                                    <th
                                        key={index}
                                        className="p-3 bg-gray-100 border font-medium"
                                    >
                                        {renderInline(cell)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, index) => (
                                        <td
                                            key={index}
                                            className="p-3 border align-top"
                                        >
                                            {renderInline(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>,
            );

            continue;
        }

        if (/^\d+\. /.test(line)) {
            const items = collect((current) => /^\d+\. /.test(current));

            blocks.push(
                <ol key={key} className="grid gap-2 pl-6 list-decimal">
                    {items.map((item, index) => (
                        <li key={index}>
                            {renderInline(item.replace(/^\d+\. /, ""))}
                        </li>
                    ))}
                </ol>,
            );

            continue;
        }

        if (line.startsWith("- ")) {
            const items = collect((current) => current.startsWith("- "));

            blocks.push(
                <ul key={key} className="grid gap-2 pl-6 list-disc">
                    {items.map((item, index) => (
                        <li key={index}>{renderInline(item.slice(2))}</li>
                    ))}
                </ul>,
            );

            continue;
        }

        const paragraph = [line];

        i++;

        while (
            i < lines.length &&
            lines[i].trim() &&
            !/^(#{1,3} |> |\||- |\d+\. |---\s*$)/.test(lines[i])
        ) {
            paragraph.push(lines[i]);

            i++;
        }

        blocks.push(
            <p key={key} className="text-pretty">
                {renderInline(paragraph.join(" "))}
            </p>,
        );
    }

    return blocks;
}

export default function LegalDocument({
    source,
}: Readonly<LegalDocumentProps>) {
    return (
        <main className="container mx-auto mb-auto px-5 py-10 md:py-16">
            <p className="mb-6 text-sm text-gray-500">
                Legal documents are available in Polish only.
            </p>
            <article
                lang="pl"
                className="grid gap-4 max-w-4xl md:text-lg leading-relaxed"
            >
                {renderBlocks(source)}
            </article>
        </main>
    );
}
