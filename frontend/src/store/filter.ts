import {create} from "zustand";

interface FilterState {
    filterTitle: string,
    setFilterTitle: (filterTitle: string) => void;
    filterDate: Date | null, 
    setFilterDate: (filterDate: Date | null) => void;
    resetFilter: () => void;
}

const useFilterStore = create<FilterState>((set) => ({
    filterTitle: "",
    setFilterTitle: (filterTitle: string) => set({ filterTitle }),
    filterDate: null,
    setFilterDate: (filterDate: Date | null) => set({ filterDate }),
    resetFilter: () => set({filterDate: null, filterTitle: ""}),
}));

export default useFilterStore;