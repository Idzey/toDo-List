import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import { useEffect, useState } from "react";
import Tasks from "./types/tasks";
import taskService from "./services/taskService";
import Wrapper from "./components/wrapper/Wrapper";
import useTasksStore from "./store/tasks";
import { Layout, Spin } from "antd";
import Sider from "antd/es/layout/Sider";
import SidebarMenu from "./components/menu/SidebarMenu";
import useUserStore from "./store/user";
import userService from "./services/userService";
import AccountPage from "./pages/AccountPage";
import axios from "axios";
import VerifyEmail from "./pages/VerifyEmail";
import { openErrorNotification } from "./components/notification/Notification";
import CalendarPage from "./pages/CalendarPage";
import dayjs from "dayjs";
import calendarService from "./services/calendarService";
import type { TCalendarTask, TCalendarTodo } from "./types/calendar";
import isoWeek from "dayjs/plugin/isoWeek";
import useCalendarStore from "./store/calendar";

dayjs.extend(isoWeek);
axios.defaults.withCredentials = true;

const colors = [
  "bg-peach-light",
  "bg-peach-dark",
  "bg-yellow-light",
  "bg-yellow-dark",
  "bg-aqua-light",
  "bg-aqua-dark",
];

type TCalendarData = {
  week: TCalendarTask[];
  month: TCalendarTask[];
  year: TCalendarTask[];
};

function App() {
  const { setTasks } = useTasksStore();
  const { user, setUser, logoutUser } = useUserStore();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("isOpenMenu") == "true"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [calendarTodos, setCalendarTodos] = useState<TCalendarTodo[]>([]);
  const {setCalendarTasksMonth,setCalendarTasksWeek,setCalendarTasksYear} = useCalendarStore();

  const randomizeColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const changeOpenMenu = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("isOpenMenu", String(value));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchTasks: Tasks = await taskService.getAll();
        setTasks(fetchTasks);
      } catch {
        openErrorNotification("loading tasks");
      }
    };

    const signupUser = async () => {
      try {
        const isTokenAlready = await userService.refreshUserToken();

        if (!isTokenAlready) {
          return false;
        }

        const data = await userService.loginUserForToken();
        setUser({
          username: data.username,
          tasks: data.tasks,
          calendarTasks: data.calendarTasks,
        });

        setInterval(async () => {
          try {
            await userService.refreshUserToken();
          } catch {
            openErrorNotification("authorization error");
            userService.logoutUser();
            logoutUser();
          }
        }, 25 * 60 * 1000);

        return true;
      } catch {
        return false;
      }
    };

    const loadingPage = async () => {
      setIsLoading(true);
      const isLogged = await signupUser();
      if (isLogged) {
        await fetchTasks();
      }
      setIsLoading(false);
    };

    loadingPage();
  }, [logoutUser, setTasks, setUser]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchTodo: TCalendarTodo[] = await calendarService.getAll();
      setCalendarTodos(fetchTodo);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      const calendarData: TCalendarData = {
        week: [],
        month: [],
        year: []
      };

      let weekDate = dayjs().isoWeekday(1);
      for (let i = 0; i < 7; i++) {
        const todos: TCalendarTodo[] = calendarTodos.filter(
          (task: TCalendarTodo) => weekDate.isSame(task.date, "day")
        ) || [];

        calendarData.week.push({
          id: i,
          title: weekDate.format("dddd"),
          todos,
          color: randomizeColor(),
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
          id: i,
          title: monthDate.format("D MMM"),
          todos,
          color: randomizeColor(),
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
          id: i,
          title: yearDate.format("MMMM"),
          todos: monthTodos,
          color: randomizeColor(),
        });

        yearDate = yearDate.add(1, "month");
      }

      setCalendarTasksWeek(calendarData.week);
      setCalendarTasksMonth(calendarData.month);
      setCalendarTasksYear(calendarData.year);
    }
    
    setIsLoading(false);
  }, [user, calendarTodos]);

  return (
    <BrowserRouter>
      <Layout>
        <Sider
          breakpoint="md"
          collapsedWidth={0}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => changeOpenMenu(value)}
          className="fixed"
        >
          <SidebarMenu />
        </Sider>
        <Wrapper>
          {isLoading && <Spin size="large" fullscreen />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/task/:taskId" element={<TaskPage isCalendar={false} />} />
            <Route path="/calendarTask/:taskId" element={<TaskPage isCalendar={true} />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/verifyEmail/:token" element={<VerifyEmail />} />
            <Route
              path="/calendar"
              element={<CalendarPage />}
            />
            <Route
              path="*"
              element={<h1 className="text-center">Not Found!</h1>}
            />
          </Routes>
        </Wrapper>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
