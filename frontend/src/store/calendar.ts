import { create } from "zustand";
import type { TCalendarTask, TCalendarTodo } from '../types/calendar';
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import calendarService from "../services/calendarService";
import { openErrorNotification } from "../components/notification/Notification";

dayjs.extend(isoWeek);

type TCalendarData = {
  week: TCalendarTask[];
  month: TCalendarTask[];
  year: TCalendarTask[];
};

interface CalendarState {
  calendarTasksWeek: TCalendarTask[];
  calendarTasksMonth: TCalendarTask[];
  calendarTasksYear: TCalendarTask[];
  setCalendarTasksWeek: (tasks: TCalendarTask[]) => void;
  setCalendarTasksMonth: (tasks: TCalendarTask[]) => void;
  setCalendarTasksYear: (tasks: TCalendarTask[]) => void;
  generateCalendar: () => Promise<void>;
}

const useCalendarStore = create<CalendarState>((set) => ({
  calendarTasksWeek: [],
  calendarTasksMonth: [],
  calendarTasksYear: [],
  
  setCalendarTasksWeek: (tasks) => set({ calendarTasksWeek: tasks }),
  setCalendarTasksMonth: (tasks) => set({ calendarTasksMonth: tasks }),
  setCalendarTasksYear: (tasks) => set({ calendarTasksYear: tasks }),
  
  generateCalendar: async () => {
    try {
      const calendarTodos: TCalendarTodo[] = await calendarService.getAll();
      
      const calendarData: TCalendarData = {
        week: [],
        month: [],
        year: []
      };

      let weekDate = dayjs().isoWeekday(1);
      let id = 0;
      for (let i = 0; i < 7; i++) {
        const todos: TCalendarTodo[] = calendarTodos.filter(
          (task: TCalendarTodo) => weekDate.isSame(task.date, "day")
        ) || [];

        calendarData.week.push({
          id: id++,
          title: weekDate.format("dddd"),
          todos,
        });

        weekDate = weekDate.add(1, "day");
      }

      const daysInMonth = dayjs().daysInMonth();
      let monthDate = dayjs().startOf('month');
      
      for (let i = 0; i < daysInMonth; i++) {
        const todos: TCalendarTodo[] = calendarTodos.filter(
          (task: TCalendarTodo) => monthDate.isSame(task.date, "day")
        ) || [];

        calendarData.month.push({
          id: id++,
          title: monthDate.format("D MMM"),
          todos,
        });

        monthDate = monthDate.add(1, "day");
      }

      let yearDate = dayjs().startOf('year');
      for (let i = 0; i < 12; i++) {
        const monthTodos: TCalendarTodo[] = calendarTodos.filter(
          (task: TCalendarTodo) => {
            const taskDate = dayjs(task.date);
            return taskDate.month() === i && taskDate.year() === yearDate.year();
          }
        ) || [];

        calendarData.year.push({
          id: id++,
          title: yearDate.format("MMMM"),
          todos: monthTodos,
        });

        yearDate = yearDate.add(1, "month");
      }

      set({
        calendarTasksWeek: calendarData.week,
        calendarTasksMonth: calendarData.month,
        calendarTasksYear: calendarData.year
      });
    } catch {
      openErrorNotification("generating calendar data");

      set({
        calendarTasksWeek: [],
        calendarTasksMonth: [],
        calendarTasksYear: []
      });
    }
  }
}));

export default useCalendarStore;