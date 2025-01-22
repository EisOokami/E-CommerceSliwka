import Card from "@/components/ui/card/Card";
import RatingSelect from "@/components/ui/ratingSelect/RatingSelect";

export default function Products() {
    return (
        <section className="grid gap-5 w-full">
            <div className="flex justify-between items-center">
                <h4 className="text-lg md:text-xl text-gray-600 font-medium">
                    Selected Products:{" "}
                    <span className="text-xl md:text-2xl text-black font-medium">
                        85
                    </span>
                </h4>
                <div className="hidden md:block">
                    <RatingSelect />
                </div>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-3">
                {[...Array(9)].map((_, i) => (
                    <Card
                        key={i}
                        imageSrc="/product_image_thumb.png"
                        imageAlt="product"
                        imageWidth={250}
                        imageHeight={250}
                        title="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
                        price="$999"
                        buttonHref="/catalog"
                        buttonTheme="dark"
                        buttonText="Buy Now"
                    />
                ))}
            </div>
        </section>
    );
}
