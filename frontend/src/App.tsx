import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import { useEffect, useState } from "react";
import Tasks from "./types/tasks";
import taskService from "./services/taskService";
import Wrapper from "./components/wrapper/Wrapper";
import useTasksStore from "./store/tasks";
import { Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import SidebarMenu from "./components/menu/SidebarMenu";
import useUserStore from "./store/user";
import userService from "./services/userService";

function App() {
  const { setTasks } = useTasksStore();
  const {setUser, setUserToken} = useUserStore();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
      const fetchTasks = async () => {
        const fetchTasks: Tasks = await taskService.getAll();
        setTasks(fetchTasks);
      };

      const signupUser = async (token: string) => {
          const data = await userService.signupUser({token: token});
          taskService.setToken(token);
          setUserToken(data.token);
          setUser({username: data.username, tasks: data.tasks});
      }

      const loadingPage = async () => {
        const userToken = window.localStorage.getItem('userToken');

        if (userToken) {
            taskService.setToken(userToken);
            await signupUser(userToken);
            await fetchTasks();
        }
      }

      loadingPage();
      
  }, []);


  return (
    <BrowserRouter>
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <SidebarMenu />
        </Sider>
        <Wrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/task/:taskId" element={<TaskPage />} />
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
