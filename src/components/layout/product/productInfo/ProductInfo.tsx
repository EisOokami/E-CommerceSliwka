import { ProductInfoProps } from "./ProductInfo.interfaces";

export default function ProductInfo({ infoData }: Readonly<ProductInfoProps>) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {infoData.map((info, i) => (
                <div
                    key={i}
                    className="grid md:flex justify-items-center content-start md:items-center gap-3"
                >
                    <div className="p-4 bg-gray-100 rounded-xl">
                        <info.icon className="text-2xl text-gray-500" />
                    </div>
                    <div className="grid text-center md:text-left">
                        <span className="text-gray-500">{info.title}</span>
                        <span>{info.info}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
