import Link from "next/link";
import Tooltip from "../tooltip/Tooltip";
import { ColorSelectorProps } from "./ColorSelector.interfaces";

export default function ColorSelector({
    colorsData,
}: Readonly<ColorSelectorProps>) {
    if (!colorsData.length) {
        return null;
    }

    return (
        <div className="flex items-center gap-5">
            <span>Select color: </span>
            <div className="flex items-center gap-3">
                {colorsData.map((color) => (
                    <Tooltip key={color.id} message={color.colorName}>
                        <Link
                            href={`/catalog/${color.slug ?? ""}`}
                            className="block w-9 h-9 border border-gray-400 rounded-full"
                            style={{ backgroundColor: color.colorHex }}
                        />
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
