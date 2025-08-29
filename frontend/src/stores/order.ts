import { DeliveryStatus } from "@/types/types";
import { create } from "zustand";

interface IOrderStore {
    selectedDeliveryStatus: DeliveryStatus | "All";
    setSelectedDeliveryStatus: (
        newSelectedDeliveryStatus: DeliveryStatus | "All",
    ) => void;
}

const useOrderStore = create<IOrderStore>((set) => ({
    selectedDeliveryStatus: "All",
    setSelectedDeliveryStatus: (newSelectedDeliveryStatus) =>
        set(() => ({
            selectedDeliveryStatus: newSelectedDeliveryStatus,
        })),
}));

export default useOrderStore;
