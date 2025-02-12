import {create} from "zustand";
import Task from "../types/task";

interface TaskState {
    task: Task | null,
    setTask: (tasks: Task) => void;
}

const useSelectedTaskStore = create<TaskState>((set) => ({
    task: null,
    setTask: (task: Task) => set({task})
}));

export default useSelectedTaskStore;