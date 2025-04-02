import { TbTruckDelivery } from "react-icons/tb";
import { AiOutlineShop } from "react-icons/ai";
import { LuCircleCheckBig } from "react-icons/lu";
import { ProductInfoProps } from "./ProductInfo.interfaces";

export default function ProductInfo({ infoData }: Readonly<ProductInfoProps>) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="grid md:flex justify-items-center content-start md:items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-xl">
                    <TbTruckDelivery className="text-2xl text-gray-500" />
                </div>
                <div className="grid text-center md:text-left">
                    <span className="text-gray-500">Delivery</span>
                    <span>{infoData.delivery}</span>
                </div>
            </div>
            <div className="grid md:flex justify-items-center content-start md:items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-xl">
                    <AiOutlineShop className="text-2xl text-gray-500" />
                </div>
                <div className="grid text-center md:text-left">
                    <span className="text-gray-500">In Store</span>
                    <span>{infoData.inStore}</span>
                </div>
            </div>
            <div className="grid md:flex justify-items-center content-start md:items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-xl">
                    <LuCircleCheckBig className="text-2xl text-gray-500" />
                </div>
                <div className="grid text-center md:text-left">
                    <span className="text-gray-500">Guaranteed</span>
                    <span>{infoData.guaranteed}</span>
                </div>
            </div>
        </div>
    );
}
