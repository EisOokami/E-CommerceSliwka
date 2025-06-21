import { IImage } from "@/interfaces/interfaces";
import { create } from "zustand";

interface IProductStore {
    optionDocumentId: string;
    setOptionDocumentId: (newOptionDocumentId: string) => void;
    colorDocumentId: string;
    setColorDocumentId: (newColorDocumentId: string) => void;
    selectedOption: number;
    setSelectedOption: (newSelectedOption: number) => void;
    selectedColor: number;
    setSelectedColor: (newSelectedColor: number) => void;
    colorSliderImages: IImage[] | null;
    setColorSliderImages: (newColorSliderImages: IImage[] | null) => void;
}

const useProductStore = create<IProductStore>((set) => ({
    optionDocumentId: "",
    setOptionDocumentId: (newOptionDocumentId) =>
        set(() => ({
            optionDocumentId: newOptionDocumentId,
        })),
    colorDocumentId: "",
    setColorDocumentId: (newColorDocumentId) =>
        set(() => ({
            colorDocumentId: newColorDocumentId,
        })),
    selectedOption: 0,
    setSelectedOption: (newSelectedOption) =>
        set(() => ({
            selectedOption: newSelectedOption,
        })),
    selectedColor: 0,
    setSelectedColor: (newSelectedColor) =>
        set(() => ({
            selectedColor: newSelectedColor,
        })),
    colorSliderImages: null,
    setColorSliderImages: (newColorSliderImages) =>
        set(() => ({
            colorSliderImages: newColorSliderImages,
        })),
}));

export default useProductStore;
