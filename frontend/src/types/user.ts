import { CalendarTodo } from "./calendar";
import Tasks from "./tasks";

type User = {
    username: string,
    tasks: Tasks,
    calendarTasks: CalendarTodo[],
}

export default User;