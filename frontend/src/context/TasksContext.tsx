import React, { createContext, useContext } from 'react';
import Tasks from '../types/tasks';

const TasksContext = createContext<{
  tasks: Tasks;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  tasksNode: Tasks;
  setTasksNode: React.Dispatch<React.SetStateAction<Tasks>>;
}>({ 
  tasks: [], 
  setTasks: () => {},
  tasksNode: [],
  setTasksNode: () => {},
});

export {TasksContext};

const useTasksContext = () => useContext(TasksContext);

export default useTasksContext;