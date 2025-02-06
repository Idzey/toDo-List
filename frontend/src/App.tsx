import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import React, { useEffect } from "react";
import Tasks from "./types/tasks";
import taskService from "./services/taskService";
import { TasksContext } from "./context/TasksContext";
import Wrapper from "./components/wrapper/Wrapper";

function App() {
  const [tasksNode, setTasksNode] = React.useState<Tasks>([]);
  const [tasks, setTasks] = React.useState<Tasks>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks: Tasks = await taskService.getAll();

      setTasksNode(tasks);
      setTasks(tasks);
    };
    
    fetchTasks();
  }, []);

  useEffect(() => {
    setTasks(tasksNode);
  }, [tasksNode]);

  return (
    <TasksContext.Provider value={{ tasks, setTasks, tasksNode, setTasksNode }}>
      <Wrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/task/:taskId" element={<TaskPage />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </TasksContext.Provider>
  );
}

export default App;
