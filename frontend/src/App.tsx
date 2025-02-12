import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import { useEffect } from "react";
import Tasks from "./types/tasks";
import taskService from "./services/taskService";
import Wrapper from "./components/wrapper/Wrapper";
import useTasksStore from "./store/tasks";

function App() {
  const { setTasks } = useTasksStore();

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchTasks: Tasks = await taskService.getAll();

      setTasks(fetchTasks);
    };

    fetchTasks();
  }, []);

  return (
    <BrowserRouter>
      <Wrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task/:taskId" element={<TaskPage />} />
          <Route path="*" element={<h1 className="text-center">Not Found!</h1>} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
