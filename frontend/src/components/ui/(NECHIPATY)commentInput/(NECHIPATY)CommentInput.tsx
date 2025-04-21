import { MdOutlineImage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

export default function CommentInput() {
    return (
        <div className="flex gap-2 p-3 border rounded-xl">
            <textarea rows={1} className="w-full text-xl outline-none" />
            <MdOutlineImage className="text-3xl text-gray-500 cursor-pointer" />
            <IoMdSend className="text-3xl text-blue-600 cursor-pointer" />
        </div>
    );
}
