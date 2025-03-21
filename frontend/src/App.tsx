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
import useCalendarStore from "./store/calendar";
import NotFoundPage from "./pages/NotFoundPage";

axios.defaults.withCredentials = true;

function App() {
  const { setTasks } = useTasksStore();
  const { user, setUser, logoutUser } = useUserStore();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("isOpenMenu") == "true"
  );
  const [isLoading, setIsLoading] = useState(false);
  const {generateCalendar} = useCalendarStore();  

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
    setIsLoading(true);

    if (user) {
      generateCalendar();
    }
    
    setIsLoading(false);
  }, [user, generateCalendar]);

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
              element={<NotFoundPage />}
            />
          </Routes>
        </Wrapper>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
