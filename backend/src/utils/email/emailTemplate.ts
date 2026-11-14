export function emailTemplate({
    title,
    heading,
    description,
    buttonText,
    buttonUrl,
    footer,
    logo,
    children = "",
}: {
    title?: string;
    heading?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
    footer?: string;
    logo?: string;
    children?: string;
}) {
    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${title}</title>
            </head>
            <body
                style="
                    margin: 0;
                    padding: 40px 20px;
                    background: #fafafa;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Arial,
                        sans-serif;
                "
            >
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                    <tr>
                        <td align="center">
                            <table
                                width="620"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                                style="
                                    width: 620px;
                                    max-width: 100%;
                                    background: #ffffff;
                                    border: 1px solid #e5e5e5;
                                    border-radius: 12px;
                                    overflow: hidden;
                                "
                            >
                                <tr>
                                    <td
                                        style="
                                            padding: 32px;
                                            border-bottom: 1px solid #e5e5e5;
                                        "
                                    >
                                        <img
                                            src="${logo}"
                                            alt="Logo"
                                            width="42"
                                            height="42"
                                            style="
                                                width:42px;
                                                height:42px;
                                                border-radius:10px;
                                                object-fit:cover;
                                                display:block;
                                            "
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 32px 32px">
                                        <h1
                                            style="
                                                margin: 0;
                                                font-size: 30px;
                                                font-weight: 700;
                                                color: #0a0a0a;
                                                letter-spacing: -0.03em;
                                            "
                                        >
                                            ${heading}
                                        </h1>
                                        <p
                                            style="
                                                margin: 18px 0 0;
                                                font-size: 16px;
                                                line-height: 28px;
                                                color: #71717a;
                                            "
                                        >
                                            ${description}
                                        </p>
                                        ${children} ${
                                            buttonText
                                                ? `
                                                    <table
                                                        role="presentation"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                        style="margin-top: 34px"
                                                    >
                                                        <tr>
                                                            <td
                                                                style="
                                                                    background: #0096ff;
                                                                    border-radius: 8px;
                                                                "
                                                            >
                                                                <a
                                                                    href="${buttonUrl}"
                                                                    style="
                                                                        display: inline-block;
                                                                        padding: 14px 28px;
                                                                        color: white;
                                                                        text-decoration: none;
                                                                        font-size: 15px;
                                                                        font-weight: 600;
                                                                    "
                                                                >
                                                                    ${buttonText}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                `
                                                : ""
                                        } ${
                                            buttonUrl
                                                ? `
                                                    <p
                                                        style="
                                                            margin-top: 28px;
                                                            font-size: 14px;
                                                            line-height: 24px;
                                                            color: #71717a;
                                                            word-break: break-word;
                                                        "
                                                    >
                                                        If the button doesn't work, copy and paste
                                                        this link:
                                                        <br /><br />
                                                        <a
                                                            href="${buttonUrl}"
                                                            style="
                                                                color: #0096ff;
                                                                text-decoration: none;
                                                            "
                                                        >
                                                            ${buttonUrl}
                                                        </a>
                                                    </p>
                                                `
                                                : ""
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="
                                            padding: 24px 32px;
                                            border-top: 1px solid #e5e5e5;
                                            background: #fafafa;
                                        "
                                    >
                                        <p
                                            style="
                                                margin: 0;
                                                font-size: 13px;
                                                line-height: 22px;
                                                color: #71717a;
                                            "
                                        >
                                            ${footer}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}
