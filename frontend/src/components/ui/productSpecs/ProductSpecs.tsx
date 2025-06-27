import { IconType } from "react-icons";
import {
    MdOutlineSmartphone,
    MdOutlineCamera,
    MdCamera,
    MdPhotoCameraBack,
} from "react-icons/md";
import { GoCpu } from "react-icons/go";
import { IoBatteryFull, IoVideocamOutline } from "react-icons/io5";
import { FaEye, FaHeadphones } from "react-icons/fa";
import { RiRefreshLine, RiWeightLine, RiCameraLensLine } from "react-icons/ri";
import { IoIosLaptop } from "react-icons/io";
import { GrStorage } from "react-icons/gr";
import { PiUserSound } from "react-icons/pi";
import { TbPhotoSensor, TbFocusAuto } from "react-icons/tb";
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
    sensor: TbPhotoSensor,
    iso: RiCameraLensLine,
    autofocus: TbFocusAuto,
    resolution: IoVideocamOutline,
    screen: MdPhotoCameraBack,
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
                        <div>
                            <Icon className="text-xl md:text-2xl" />
                        </div>
                        <div className="grid">
                            <span className="text-sm md:text-base text-gray-500">
                                {spec.name}
                            </span>
                            <span className="text-xs md:text-sm">
                                {spec.specification}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
