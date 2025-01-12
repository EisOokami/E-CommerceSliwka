import Card from "@/components/ui/card/Card";

export default function DiscountsShowcase() {
    return (
        <section className="container mx-auto px-3 py-10">
            <div className="mb-8">
                <h4 className="text-2xl md:text-3xl font-medium">
                    Discounts uр to -50%
                </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <Card
                        key={i}
                        imageSrc="/product_image_thumb.png"
                        imageAlt="product"
                        imageWidth={250}
                        imageHeight={250}
                        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
                        price="$999"
                        buttonTheme="dark"
                        buttonText="Buy Now"
                    />
                ))}
            </div>
        </section>
    );
}
