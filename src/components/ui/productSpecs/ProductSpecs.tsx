import { ProductSpecsProps } from "./ProductSpecs.interfaces";

export default function ProductSpecs({
    specsData,
}: Readonly<ProductSpecsProps>) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
            {specsData.map((spec, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl"
                >
                    <spec.icon className="text-2xl" />
                    <div className="grid">
                        <span className="text-gray-500">{spec.title}</span>
                        <span>{spec.spec}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
