import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const legalVersions = () => {
    const terms = process.env.TERMS_VERSION;
    const privacy = process.env.PRIVACY_VERSION;

    if (!terms || !privacy) {
        throw new Error("TERMS_VERSION and PRIVACY_VERSION must be set");
    }

    return { terms, privacy };
};
