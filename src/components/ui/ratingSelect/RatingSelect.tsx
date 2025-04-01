import { RatingSelectProps } from "./RatingSelect.interfaces";

export default function RatingSelect({ setProductRating }: RatingSelectProps) {
    const handleUpdateProductRating = (value: string) => {
        setProductRating(value);
    };

    return (
        <select
            name="by_rating"
            id="by_rating"
            className="w-full md:w-52 px-3 py-2 outline outline-1 outline-[#e5e7eb] border-r-[12px] border-r-transparent rounded-md"
            defaultValue="DEFAULT"
            onChange={(e) => handleUpdateProductRating(e.target.value)}
        >
            <option value="DEFAULT" disabled hidden>
                By rating
            </option>
            <option value="all">All</option>
            <option value="5.0">5.0</option>
            <option value="4.8">From 4.8</option>
            <option value="4.5">From 4.5</option>
            <option value="4.0">From 4.0</option>
            <option value="3.0">From 3.0</option>
            <option value="2.0">From 2.0</option>
            <option value="1.0">From 1.0</option>
        </select>
    );
}
