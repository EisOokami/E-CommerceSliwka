import { memo } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { WarningMsgProps } from "./WarningMsg.interfaces";

const WarningMsg = memo(function WarningMsg({
    message,
}: Readonly<WarningMsgProps>) {
    return (
        <div className="flex items-center gap-2 p-5 text-white bg-yellow-300 rounded-xl">
            <IoWarningOutline className="text-4xl" />
            <p className="text-xl md:text-2xl">{message}</p>
        </div>
    );
});

export default WarningMsg;
