import useCatalogStore from "@/stores/catalog";

export default function RatingSelect() {
    const setProductRating = useCatalogStore((state) => state.setProductRating);

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
            <option value="4.8">Above 4.8</option>
            <option value="4.5">Above 4.5</option>
            <option value="4.0">Above 4.0</option>
            <option value="0.0">Below 4.0</option>
        </select>
    );
}
