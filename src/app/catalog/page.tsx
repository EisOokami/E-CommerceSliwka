import BreadcrumbContainer from "@/components/layout/catalog/breadcrumbContainer/BreadcrumbContainer";
import AccordionContainer from "@/components/layout/catalog/accordionContainer/AccordionContainer";

export default function Catalog() {
    return (
        <main className="relative py-10">
            <BreadcrumbContainer />
            <AccordionContainer />
        </main>
    );
}
