import { createContext, useContext } from "react";
import Task from "../types/task";

const TaskContext = createContext<{
  task: Task | null;
  setTasks: React.Dispatch<React.SetStateAction<Task | null>>;
}>({ task: null, setTasks: () => {} });

export {TaskContext};

const useTaskContext = () => useContext(TaskContext);

export default useTaskContext;