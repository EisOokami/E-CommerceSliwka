import { IconType } from "react-icons";
import { MdOutlineSmartphone, MdOutlineCamera, MdCamera } from "react-icons/md";
import { GoCpu } from "react-icons/go";
import { IoBatteryFull } from "react-icons/io5";
import { FaEye, FaHeadphones } from "react-icons/fa";
import { RiRefreshLine, RiWeightLine } from "react-icons/ri";
import { IoIosLaptop } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { PiUserSound } from "react-icons/pi";
import { ProductSpecsProps } from "./ProductSpecs.interfaces";

const initialIconData: { [key: string]: IconType } = {
    phone: MdOutlineSmartphone,
    cpu: GoCpu,
    mainCamera: MdOutlineCamera,
    frontCamera: MdCamera,
    battery: IoBatteryFull,
    displayVr: FaEye,
    refresh: RiRefreshLine,
    weight: RiWeightLine,
    laptop: IoIosLaptop,
    storage: GrStorage,
    headphone: FaHeadphones,
    noise: PiUserSound,
};

export default function ProductSpecs({
    specsData,
}: Readonly<ProductSpecsProps>) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
            {specsData.map((spec) => {
                const Icon = initialIconData[spec.icon];

                return (
                    <div
                        key={spec.id}
                        className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl"
                    >
                        <Icon className="text-2xl" />
                        <div className="grid">
                            <span className="text-gray-500">{spec.name}</span>
                            <span>{spec.specification}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
