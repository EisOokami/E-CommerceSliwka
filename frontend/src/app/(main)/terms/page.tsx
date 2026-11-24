import type { Metadata } from "next";
import { termsOfService } from "@/content/legal/termsOfService";

import LegalDocument from "@/components/layout/main/legalDocument/LegalDocument";

export const metadata: Metadata = {
    title: "Regulamin | E-Commerce Sliwka",
    description: "Regulamin serwisu demonstracyjnego Sliwka.",
    icons: "/icon.ico",
};

export default function TermsPage() {
    return <LegalDocument source={termsOfService} />;
}
