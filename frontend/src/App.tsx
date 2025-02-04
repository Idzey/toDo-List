import React, { useEffect } from "react";
import Wrapper from "./components/wrapper/Wrapper";
import TasksBlock from "./components/tasksBlock/TasksBlock";
import Tasks from "./types/tasks";
import CardTask from "./components/tasksBlock/cardTask/CardTask";
import taskService from "./services/taskService";
import {TaskContext} from "./context/TaskContext";
import ControlBlock from "./components/controlBlock/ControlBlock";
import { Divider } from "antd";

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

  

  return (
    <Wrapper>
      <div className="w-full">
        <h1 className="text-3xl">To-Do</h1>
        <Divider className="border-b-1 border-b-gray-300" />
      </div>

      <TaskContext.Provider value={{tasks, setTasks, tasksNode, setTasksNode}}>
        <ControlBlock />
        
        <TasksBlock>
          {tasks.map((task) => (
            <CardTask task={task} key={task.id} />
          ))}
        </TasksBlock>
      </TaskContext.Provider>
    </Wrapper>
  );
}

export default App;
