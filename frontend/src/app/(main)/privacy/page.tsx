import type { Metadata } from "next";
import { privacyPolicy } from "@/content/legal/privacyPolicy";

import LegalDocument from "@/components/layout/main/legalDocument/LegalDocument";

export const metadata: Metadata = {
    title: "Polityka prywatności | E-Commerce Sliwka",
    description: "Polityka prywatności serwisu demonstracyjnego Sliwka.",
    icons: "/icon.ico",
};

export default function PrivacyPage() {
    return <LegalDocument source={privacyPolicy} />;
}
