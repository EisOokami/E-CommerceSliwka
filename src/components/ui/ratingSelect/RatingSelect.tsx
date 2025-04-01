export default function RatingSelect() {
    return (
        <select
            name="by_rating"
            id="by_rating"
            className="w-full md:w-52 px-3 py-2 outline outline-1 outline-[#e5e7eb] border-r-[12px] border-r-transparent rounded-md"
            defaultValue="DEFAULT"
        >
            <option value="DEFAULT" disabled hidden>
                By rating
            </option>
            <option value="all">All</option>
            <option value="5.0">5.0</option>
            <option value="4.8">From 4.8</option>
            <option value="4.6">From 4.6</option>
            <option value="4.4">From 4.4</option>
        </select>
    );
}
