import {create} from "zustand";
import User from "../types/user";

interface UserState {
    user: User | null,
    userToken: string | null,
    setUser: (user: User | null) => void;
    setUserToken: (userToken: string | null) => void;
    logoutUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    userToken: null,
    setUser: (user: User | null) => set({user}),
    setUserToken: (userToken: string | null) => set({userToken}),
    logoutUser: () => {
        set({user: null});
        set({userToken: null});
    }
}));

export default useUserStore;