import { ColorSelectorProps } from "./ColorSelector.interfaces";

export default function ColorSelector({
    colorsData,
}: Readonly<ColorSelectorProps>) {
    return (
        <div className="flex items-center gap-5">
            <span>Select color: </span>
            <div className="flex items-center gap-3">
                {colorsData.map((color) => (
                    <button
                        key={color.id}
                        className="w-9 h-9 rounded-full"
                        style={{ backgroundColor: color.item }}
                    ></button>
                ))}
            </div>
        </div>
    );
}
