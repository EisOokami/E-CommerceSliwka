import BreadcrumbContainer from "@/components/layout/catalog/breadcrumbContainer/BreadcrumbContainer";
import AccordionContainer from "@/components/layout/catalog/accordionContainer/AccordionContainer";
import Products from "@/components/layout/catalog/products/Products";
import RatingSelect from "@/components/ui/ratingSelect/RatingSelect";

export default function Catalog() {
    return (
        <main className="relative py-6 md:py-10">
            <BreadcrumbContainer />
            <section className="grid md:flex md:items-center gap-5 container mx-auto mt-5 px-3 md:px-5">
                <div className="md:self-start flex justify-between items-center gap-5 md:block md:w-1/3">
                    <AccordionContainer />
                    <div className="block md:hidden w-full">
                        <RatingSelect />
                    </div>
                </div>
                <Products />
            </section>
        </main>
    );
}
