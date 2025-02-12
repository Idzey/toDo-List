import {create} from "zustand";
import Tasks from "../types/tasks";

interface TasksState {
    tasks: Tasks,
    setTasks: (tasks: Tasks) => void;
}

const useTasksStore = create<TasksState>((set) => ({
    tasks: [],
    setTasks: (tasks: Tasks) => set({tasks})
}));

export default useTasksStore;