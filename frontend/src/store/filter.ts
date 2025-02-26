import {create} from "zustand";

interface FilterState {
    filterTitle: string,
    setFilterTitle: (filterTitle: string) => void;
    resetFilter: () => void;
}

const useFilterStore = create<FilterState>((set) => ({
    filterTitle: "",
    setFilterTitle: (filterTitle: string) => set({ filterTitle }),
    resetFilter: () => set({filterTitle: ""}),
}));

export default useFilterStore;