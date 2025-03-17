import { TCalendarTask } from "./calendar";
import Tasks from "./tasks";

type User = {
    username: string,
    tasks: Tasks,
    calendarTasks: TCalendarTask[],
}

export default User;