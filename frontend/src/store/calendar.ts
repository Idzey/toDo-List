import { create } from "zustand";
import type { TCalendarTask } from '../types/calendar';

interface TasksState {
    calendarTasksWeek: TCalendarTask[];
    calendarTasksMonth: TCalendarTask[];
    calendarTasksYear: TCalendarTask[];
    setCalendarTasksWeek: (tasks: TCalendarTask[]) => void;
    setCalendarTasksMonth: (tasks: TCalendarTask[]) => void;
    setCalendarTasksYear: (tasks: TCalendarTask[]) => void;
}

const useCalendarStore = create<TasksState>((set) => ({
    calendarTasksWeek: [],
    calendarTasksMonth: [],
    calendarTasksYear: [],
    setCalendarTasksWeek: (tasks) => set({ calendarTasksWeek: tasks }),
    setCalendarTasksMonth: (tasks) => set({ calendarTasksMonth: tasks }),
    setCalendarTasksYear: (tasks) => set({ calendarTasksYear: tasks }),
}));

export default useCalendarStore;