import {create} from "zustand";
import User from "../types/user";

interface UserState {
    user: User | null,
    setUser: (user: User | null) => void;
    logoutUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: User | null) => set({user}),
    logoutUser: () => {
        set({user: null});
    }
}));

export default useUserStore;