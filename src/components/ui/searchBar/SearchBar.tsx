import { IoIosSearch } from "react-icons/io";

export default function SearchBar() {
    return (
        <div className="flex items-center gap-1 p-2 lg:p-3 text-xl text-gray-400 bg-gray-100 rounded-md">
            <IoIosSearch className="text-2xl" />
            <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 outline-none"
            />
        </div>
    );
}
