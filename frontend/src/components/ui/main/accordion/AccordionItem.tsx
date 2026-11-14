import { AccordionItem as Item } from "@szhsin/react-accordion";
import { FaChevronDown } from "react-icons/fa6";
import { AccordionItemProps } from "./Accordion.interfaces";

export default function AccordionItem({
    header,
    ...rest
}: Readonly<AccordionItemProps>) {
    return (
        <Item
            {...rest}
            header={({ state: { isEnter } }) => (
                <div className="flex justify-between items-center w-full">
                    <h4 className="text-xl font-medium">{header}</h4>
                    <FaChevronDown
                        className={`transition-transform duration-200 ease-out ${
                            isEnter && "rotate-180"
                        }`}
                    />
                </div>
            )}
            buttonProps={{
                className: () =>
                    `flex w-full my-4 py-3 text-left transition border-b-4`,
            }}
            contentProps={{
                className: "transition-height duration-200 ease-out",
            }}
            panelProps={{ className: "grid gap-2" }}
        />
    );
}
